import mongoose, { Schema, Document } from 'mongoose';

  export interface ItemTypeDocument extends Document {
  name: string;
  isRefrigeration: boolean;
}
const itemTypeSchema = new Schema<ItemTypeDocument>({
  name: {
    type: String,
    unique: true,
    required: [true,"Name already exists"]
  },
  isRefrigeration: {
    type: Boolean,
    default: false,
  },
});

const ItemType = mongoose.model<ItemTypeDocument>('ItemType', itemTypeSchema);

export default ItemType;
