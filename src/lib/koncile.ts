/**
 * Complete Koncile.ai API Integration with Task Polling
 * Implements the full workflow: upload → poll tasks → extract data
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

interface KoncileUploadResponse {
  task_ids: string[];
}

interface KoncileTaskResponse {
  status: 'DONE' | 'DUPLICATE' | 'IN PROGRESS' | 'FAILED';
  document_id?: number;
  document_name?: string;
  status_message?: string;
  General_fields?: Record<string, {
    value: string;
    confidence_score: number;
  }>;
  Line_fields?: Record<string, Array<{
    value: string;
    confidence_score: number;
  }>>;
}

// Configuration
const KONCILE_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 120000, // Increased to 2 minutes for file processing
  POLL_INTERVAL: 2000,
  MAX_POLL_ATTEMPTS: 30
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

  debug(message: string, data?: any) {
    if (this.shouldLog('debug')) {
      console.log(`🔍 [Koncile Debug] ${message}`, data || '');
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      console.log(`ℹ️ [Koncile Info] ${message}`, data || '');
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog('warn')) {
      console.warn(`⚠️ [Koncile Warning] ${message}`, data || '');
    }
  }

  error(message: string, error?: any) {
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

  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json',
      'User-Agent': 'COFICAB-Invoice-Extractor/1.0'
    };
  }

  /**
   * Step 1: Upload file to Koncile.ai using axios with extended timeout
   */
  async uploadFile(fileBuffer: Buffer, fileName: string, templateId?: string): Promise<string[]> {
    this.logger.info(`Uploading file: ${fileName}${templateId ? ` with template ${templateId}` : ' (auto-classification)'}`);

    try {
      // Build URL with optional template_id - IMPORTANT: trailing slash required!
      let url = `${this.apiUrl}/v1/upload_file/`;
      if (templateId) {
        url += `?template_id=${templateId}`;
      }

      this.logger.debug(`Uploading to URL: ${url}`);
      this.logger.debug(`File buffer size: ${fileBuffer.length} bytes`);

      // Use form-data package to properly handle multipart uploads
      // Sanitize filename to avoid special characters that might cause issues
      const sanitizedFileName = fileName.replace(/[^\w\-_.]/g, '_');
      const formData = new FormData();
      formData.append('files', fileBuffer, {
        filename: sanitizedFileName,
        contentType: 'application/octet-stream'
      });
      this.logger.debug(`FormData created successfully`);

      // Extended timeout configuration - try 5 minutes for large files
      const EXTENDED_TIMEOUT = 300000; // 5 minutes

      const response: AxiosResponse<KoncileUploadResponse> = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'COFICAB-Invoice-Extractor/1.0',
          ...formData.getHeaders()
        },
        timeout: EXTENDED_TIMEOUT,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        // Disable keep-alive to prevent connection reuse issues
        httpAgent: new (require('http').Agent)({ keepAlive: false }),
        httpsAgent: new (require('https').Agent)({ keepAlive: false }),
        maxRedirects: 5,
        validateStatus: (status: number) => status < 500,
      });

      this.logger.debug(`Response status: ${response.status}`);
      this.logger.info(`Upload successful, got task IDs: ${response.data.task_ids.join(', ')}`);
      
      return response.data.task_ids;
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          throw new Error('Upload timeout - the file is taking too long to process. Please try with a smaller file or check your internet connection.');
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
            timeout: error.config?.timeout
          }
        });
        
        const errorMsg = error.response?.data || error.message;
        const status = error.response?.status || 'Network Error';
        throw new Error(`Upload failed: ${status} - ${errorMsg}`);
      }
      this.logger.error(`Upload error details:`, error);
      throw error;
    }
  }

  /**
   * Step 2: Poll task status until completion
   */
  async pollTaskStatus(taskId: string): Promise<KoncileTaskResponse> {
    this.logger.info(`Polling task status: ${taskId}`);

    for (let attempt = 1; attempt <= KONCILE_CONFIG.MAX_POLL_ATTEMPTS; attempt++) {
      try {
        // Use correct endpoint from documentation
        const response = await fetch(`${this.apiUrl}/v1/fetch_tasks_results/?task_id=${taskId}`, {
          method: 'GET',
          headers: this.getHeaders()
        });

        if (!response.ok) {
          throw new Error(`Task status check failed: ${response.status}`);
        }

        const result: KoncileTaskResponse = await response.json();
        this.logger.debug(`Task ${taskId} status: ${result.status}`);

        // Check if task is completed
        if (result.status === 'DONE') {
          this.logger.info(`Task ${taskId} completed successfully`);
          return result;
        }

        // Check if task failed
        if (result.status === 'FAILED') {
          throw new Error(`Task failed: ${result.status_message || 'Unknown error'}`);
        }

        // Task still processing, wait before next poll
        if (attempt < KONCILE_CONFIG.MAX_POLL_ATTEMPTS) {
          this.logger.debug(`Task ${taskId} still processing, waiting ${KONCILE_CONFIG.POLL_INTERVAL}ms...`);
          await new Promise(resolve => setTimeout(resolve, KONCILE_CONFIG.POLL_INTERVAL));
        }

      } catch (error) {
        if (attempt === KONCILE_CONFIG.MAX_POLL_ATTEMPTS) {
          throw error;
        }
        this.logger.warn(`Poll attempt ${attempt} failed, retrying...`, error);
        await new Promise(resolve => setTimeout(resolve, KONCILE_CONFIG.POLL_INTERVAL));
      }
    }

    throw new Error(`Task ${taskId} did not complete within timeout period`);
  }

  /**
   * Complete extraction workflow: upload → poll → extract
   */
  async extractWithTemplate(fileBuffer: Buffer, fileName: string, templateId: string): Promise<Record<string, any>> {
    try {
      // Step 1: Upload file
      const taskIds = await this.uploadFile(fileBuffer, fileName, templateId);
      
      if (!taskIds || taskIds.length === 0) {
        throw new Error('No task IDs returned from upload');
      }

      // Step 2: Poll first task (usually there's only one)
      const taskResult = await this.pollTaskStatus(taskIds[0]);

      // Step 3: Extract data from result using correct response structure
      const extractedData: Record<string, any> = {};
      
      // Combine General_fields and Line_fields
      if (taskResult.General_fields) {
        Object.entries(taskResult.General_fields).forEach(([key, field]) => {
          extractedData[key] = {
            value: field.value,
            confidence_score: field.confidence_score
          };
        });
      }
      
      if (taskResult.Line_fields) {
        Object.entries(taskResult.Line_fields).forEach(([key, fields]) => {
          // For line fields, take the first occurrence or combine them
          if (fields.length > 0) {
            extractedData[key] = {
              value: fields[0].value,
              confidence_score: fields[0].confidence_score
            };
          }
        });
      }

      if (Object.keys(extractedData).length > 0) {
        this.logger.info('Successfully extracted data from document');
        return extractedData;
      }

      throw new Error('No extracted data found in task result');

    } catch (error) {
      // If template-specific extraction fails, try auto-classification
      if (templateId && error instanceof Error && error.message.includes('404')) {
        this.logger.warn(`Template ${templateId} failed, trying auto-classification`);
        return await this.extractWithAutoClassification(fileBuffer, fileName);
      }
      throw error;
    }
  }

  /**
   * Fallback: Auto-classification extraction
   */
  async extractWithAutoClassification(fileBuffer: Buffer, fileName: string): Promise<Record<string, any>> {
    this.logger.info('Using auto-classification for extraction');
    
    // Step 1: Upload without template_id
    const taskIds = await this.uploadFile(fileBuffer, fileName);
    
    if (!taskIds || taskIds.length === 0) {
      throw new Error('No task IDs returned from auto-classification upload');
    }

    // Step 2: Poll task
    const taskResult = await this.pollTaskStatus(taskIds[0]);

    // Step 3: Extract data using correct response structure
    const extractedData: Record<string, any> = {};
    
    // Combine General_fields and Line_fields
    if (taskResult.General_fields) {
      Object.entries(taskResult.General_fields).forEach(([key, field]) => {
        extractedData[key] = {
          value: field.value,
          confidence_score: field.confidence_score
        };
      });
    }
    
    if (taskResult.Line_fields) {
      Object.entries(taskResult.Line_fields).forEach(([key, fields]) => {
        // For line fields, take the first occurrence or combine them
        if (fields.length > 0) {
          extractedData[key] = {
            value: fields[0].value,
            confidence_score: fields[0].confidence_score
          };
        }
      });
    }

    if (Object.keys(extractedData).length > 0) {
      this.logger.info('Successfully extracted data using auto-classification');
      return extractedData;
    }

    throw new Error('No extracted data found in auto-classification result');
  }

  async testConnection(): Promise<boolean> {
    try {
      this.logger.info('Testing Koncile API connection');
      
      // Test with template fetch endpoint using correct query parameter format
      const response = await fetch(`${this.apiUrl}/v1/fetch_template/?template_id=18982`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const isConnected = response.ok;
      this.logger.info(`Connection test ${isConnected ? 'successful' : 'failed'} (status: ${response.status})`);
      
      return isConnected;
    } catch (error) {
      this.logger.error('Connection test failed', error);
      return false;
    }
  }
}

// Data transformation utilities
function transformKoncileResponse(extractedData: Record<string, any>, confidenceScore?: number): Record<string, ExtractedField> {
  const logger = KoncileLogger.getInstance();
  const transformedData: Record<string, ExtractedField> = {};
  let fieldsProcessed = 0;

  Object.entries(extractedData).forEach(([key, value]: [string, any]) => {
    if (value && typeof value === 'object') {
      transformedData[key] = {
        value: value.value || String(value.text || value.content || ''),
        confidence: value.confidence_score || value.confidence || confidenceScore || 0.9,
        position: value.position || undefined
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

    // Extract with template using complete workflow
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
