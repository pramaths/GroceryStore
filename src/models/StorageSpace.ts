import mongoose,{ Schema, model, Document } from 'mongoose';

 export interface StorageSpaceDocument extends Document {
  name: string;
  maxLimit: number;
  refrigerate: number;
}

const storageSpaceSchema = new Schema<StorageSpaceDocument>({
  name: {
    type: String,
    unique: true,
    required:  [true,"Name already exists"]
  },
  maxLimit: {
    type: Number,
    required: true,
  },
  refrigerate: {
    type: Number,
    default: 0,
  },
});

const StorageSpace = model<StorageSpaceDocument>('StorageSpace', storageSpaceSchema);

export default StorageSpace;