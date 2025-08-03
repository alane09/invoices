import mongoose from 'mongoose';

export interface IInvoice {
  _id?: string;
  type: 'electricity' | 'gas' | 'water';
  fileName: string;
  date?: string;
  month?: string;
  data: Record<string, any>;
  status?: 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new mongoose.Schema<IInvoice>({
  type: {
    type: String,
    required: true,
    enum: ['electricity', 'gas', 'water']
  },
  fileName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: ''
  },
  month: {
    type: String,
    default: ''
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
