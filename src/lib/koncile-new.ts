/**
 * Koncile.ai API Integration using Direct Template Extraction
 * Uses the correct API endpoint: /api/templates/{template_id}/extract/
 */

import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { performance } from 'perf_hooks';

// Types and Interfaces
export interface KoncileResponse {
  success: boolean;
  data?: Record<string, ExtractedField>;
  error?: string;
  processingTime?: number;
  metadata?: {
    confidence?: number;
    fieldsExtracted?: number;
  };
}

export interface ExtractedField {
  value: string;
  confidence: number;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Direct extraction response from Koncile.ai
interface KoncileDirectResponse {
  [key: string]: {
    value: string;
    confidence_score: number;
    position?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

// Configuration
const KONCILE_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 120000, // Increased to 2 minutes for file processing
} as const;

// Advanced logging utility
class KoncileLogger {
  private static instance: KoncileLogger;
  private logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';

  static getInstance(): KoncileLogger {
    if (!KoncileLogger.instance) {
      KoncileLogger.instance = new KoncileLogger();
    }
    return KoncileLogger.instance;
  }

  setLogLevel(level: 'debug' | 'info' | 'warn' | 'error') {
    this.logLevel = level;
  }

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  debug(message: string, data?: unknown) {
    if (this.shouldLog('debug')) {
      console.log(`🔍 [Koncile Debug] ${message}`, data || '');
    }
  }

  info(message: string, data?: unknown) {
    if (this.shouldLog('info')) {
      console.log(`ℹ️ [Koncile Info] ${message}`, data || '');
    }
  }

  warn(message: string, data?: unknown) {
    if (this.shouldLog('warn')) {
      console.warn(`⚠️ [Koncile Warning] ${message}`, data || '');
    }
  }

  error(message: string, error?: unknown) {
    if (this.shouldLog('error')) {
      console.error(`❌ [Koncile Error] ${message}`, error || '');
    }
  }
}

// Template ID mapping - confirmed working IDs
const getTemplateId = (invoiceType: string): string => {
  const templateMap = {
    electricity: '18982', // Electricité - confirmed working
    gas: '18983',         // GAZ - confirmed working  
    water: '18984'        // WATER - confirmed working
  };

  if (!templateMap[invoiceType as keyof typeof templateMap]) {
    throw new Error(`Unsupported invoice type: ${invoiceType}. Supported types: ${Object.keys(templateMap).join(', ')}`);
  }

  return templateMap[invoiceType as keyof typeof templateMap];
};

// Retry mechanism
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = KONCILE_CONFIG.MAX_RETRIES,
  baseDelay: number = KONCILE_CONFIG.RETRY_DELAY
): Promise<T> {
  const logger = KoncileLogger.getInstance();
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        logger.error(`Operation failed after ${maxRetries} attempts`, error);
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Retry mechanism failed unexpectedly');
}

// Professional API client class
class KoncileAPIClient {
  private apiKey: string;
  private apiUrl: string;
  private logger: KoncileLogger;

  constructor() {
    this.apiKey = process.env.KONCILE_API_KEY || 'pO-kPRnJZUReTMNNZyw9q8OZPhihMUtflROvF1lYEls';
    this.apiUrl = process.env.KONCILE_API_URL || 'https://api.koncile.ai';
    this.logger = KoncileLogger.getInstance();

    if (!this.apiKey) {
      throw new Error('KONCILE_API_KEY environment variable is required');
    }

    this.logger.setLogLevel(process.env.NODE_ENV === 'development' ? 'debug' : 'info');
  }

  /**
   * Direct extraction using the correct API endpoint
   * POST https://api.koncile.ai/api/templates/{template_id}/extract/
   */
  async extractWithTemplate(fileBuffer: Buffer, fileName: string, templateId: string): Promise<Record<string, unknown>> {
    this.logger.info(`Extracting data using template ${templateId} for file: ${fileName}`);

    try {
      // Build correct URL according to documentation
      const url = `${this.apiUrl}/api/templates/${templateId}/extract/`;
      
      this.logger.debug(`Extracting from URL: ${url}`);
      this.logger.debug(`File buffer size: ${fileBuffer.length} bytes`);

      // Use form-data package to properly handle multipart uploads
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: fileName,
        contentType: 'application/octet-stream'
      });

      this.logger.debug(`FormData created successfully`);

      const response: AxiosResponse<KoncileDirectResponse> = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'COFICAB-Invoice-Extractor/1.0',
          ...formData.getHeaders()
        },
        timeout: KONCILE_CONFIG.TIMEOUT,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      this.logger.debug(`Response status: ${response.status}`);
      this.logger.info(`Extraction successful, got ${Object.keys(response.data).length} fields`);
      
      return response.data as Record<string, unknown>;
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Extraction timeout - please try with a smaller file');
        }
        
        // Log detailed error information
        this.logger.error(`Axios error details:`, {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          }
        });
        
        const errorMsg = error.response?.data || error.message;
        const status = error.response?.status || 'Network Error';
        throw new Error(`Extraction failed: ${status} - ${errorMsg}`);
      }
      this.logger.error(`Extraction error details:`, error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      this.logger.info('Testing Koncile API connection');
      
      // Test with a simple GET request to check API availability
      const response = await axios.get(`${this.apiUrl}/api/templates/`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'COFICAB-Invoice-Extractor/1.0'
        },
        timeout: 10000
      });

      const isConnected = response.status === 200;
      this.logger.info(`Connection test ${isConnected ? 'successful' : 'failed'} (status: ${response.status})`);
      
      return isConnected;
    } catch (error) {
      this.logger.error('Connection test failed', error);
      return false;
    }
  }
}

// Data transformation utilities
function transformKoncileResponse(extractedData: Record<string, unknown>, confidenceScore?: number): Record<string, ExtractedField> {
  const logger = KoncileLogger.getInstance();
  const transformedData: Record<string, ExtractedField> = {};
  let fieldsProcessed = 0;

  Object.entries(extractedData).forEach(([key, value]: [string, unknown]) => {
    if (value && typeof value === 'object') {
      const objValue = value as { 
        value?: string; 
        text?: string; 
        content?: string; 
        confidence_score?: number; 
        confidence?: number; 
        position?: { x: number; y: number; width: number; height: number } 
      };
      transformedData[key] = {
        value: objValue.value || String(objValue.text || objValue.content || ''),
        confidence: objValue.confidence_score || objValue.confidence || confidenceScore || 0.9,
        position: objValue.position || undefined
      };
    } else {
      transformedData[key] = {
        value: String(value || ''),
        confidence: confidenceScore || 0.9
      };
    }
    fieldsProcessed++;
  });

  logger.info(`Transformed ${fieldsProcessed} fields from Koncile response`);
  return transformedData;
}

// Main extraction function
export async function extractInvoiceData(
  fileBuffer: Buffer,
  fileName: string,
  invoiceType: string
): Promise<KoncileResponse> {
  const logger = KoncileLogger.getInstance();
  const startTime = performance.now();

  try {
    logger.info(`Starting extraction for ${invoiceType} invoice: ${fileName}`);

    // Validate inputs
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('Invalid file buffer provided');
    }

    if (!fileName || fileName.trim().length === 0) {
      throw new Error('Invalid file name provided');
    }

    const templateId = getTemplateId(invoiceType);
    const client = new KoncileAPIClient();

    // Extract with template using direct API call
    const extractedData = await withRetry(async () => {
      return await client.extractWithTemplate(fileBuffer, fileName, templateId);
    });

    const processingTime = performance.now() - startTime;
    logger.info(`Extraction completed in ${Math.round(processingTime)}ms`);

    const transformedData = transformKoncileResponse(extractedData);
    const fieldsCount = Object.keys(transformedData).length;

    // Calculate average confidence
    const confidenceScores = Object.values(transformedData).map(field => field.confidence);
    const avgConfidence = confidenceScores.length > 0 
      ? confidenceScores.reduce((sum, conf) => sum + conf, 0) / confidenceScores.length 
      : 0.9;

    return {
      success: true,
      data: transformedData,
      processingTime: Math.round(processingTime),
      metadata: {
        confidence: Math.round(avgConfidence * 100) / 100,
        fieldsExtracted: fieldsCount
      }
    };

  } catch (error) {
    const processingTime = performance.now() - startTime;
    logger.error(`Extraction failed after ${Math.round(processingTime)}ms`, error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown extraction error',
      processingTime: Math.round(processingTime)
    };
  }
}

// Health check
export async function testKoncileConnection(): Promise<{
  connected: boolean;
  details: {
    apiKey: boolean;
    apiUrl: string;
    responseTime?: number;
    error?: string;
  };
}> {
  const logger = KoncileLogger.getInstance();
  const startTime = performance.now();

  try {
    const client = new KoncileAPIClient();
    const connected = await client.testConnection();
    const responseTime = Math.round(performance.now() - startTime);

    return {
      connected,
      details: {
        apiKey: !!process.env.KONCILE_API_KEY,
        apiUrl: process.env.KONCILE_API_URL || 'https://api.koncile.ai',
        responseTime
      }
    };
  } catch (error) {
    const responseTime = Math.round(performance.now() - startTime);
    logger.error('Connection test failed', error);

    return {
      connected: false,
      details: {
        apiKey: !!process.env.KONCILE_API_KEY,
        apiUrl: process.env.KONCILE_API_URL || 'https://api.koncile.ai',
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}
