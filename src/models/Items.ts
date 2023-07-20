import mongoose, { Schema, Document } from 'mongoose';
import { ItemTypeDocument } from './ItemTypes';
interface ItemDocument extends Document {
  name:String;
  itemTypeId: mongoose.Types.ObjectId;
  storageSpaceId: mongoose.Types.ObjectId; 
  expirationDate: Date;
  
}

const itemSchema = new Schema<ItemDocument>({
  name: {
    type: String,
    required: true,
  },
  itemTypeId: {
    type: Schema.Types.ObjectId,
    ref: 'ItemType',
    required: true,
    immutable:true
  },
  storageSpaceId: {
    type: Schema.Types.ObjectId,
    ref: 'StorageSpace',
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
    immutable:true
  },
});

const Item = mongoose.model<ItemDocument>('Item', itemSchema);

export default Item;
