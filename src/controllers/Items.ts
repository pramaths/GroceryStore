import { Request, Response } from "express";
import Item from "../models/Items";
import StorageSpace from "../models/StorageSpace";
import ItemType from "../models/ItemTypes";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});
/**
 * @swagger
 * /api/createItem:
 *   post:
 *     summary: Create a new item
 *     description: Create a new item with the provided details
 *     parameters:
 *       - in: body
 *         name: item
 *         description: The item object to create
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             itemTypeId:
 *               type: string
 *             storageSpaceId:
 *               type: string
 *             expirationDate:
 *               type: string
 *               format: date   
 *               example: "2023-07-31"    
 *     responses:
 *       201:
 *         description: Successfully created a new item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item type not found or Storage space not found
 *       400:
 *         description: Item type or storage space not found or no available space for items
 *       500:
 *         description: Internal server error
 */

export const createItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, itemTypeId, storageSpaceId, expirationDate } = req.body;
    const itemtype = await ItemType.findById(itemTypeId);

    if (!itemtype) {
      res.status(404).json({ info: "Item type not found" });
      return;
    }

    const storageSpace = await StorageSpace.findById(storageSpaceId);

    if (!storageSpace) {
      res.status(404).json({ info: "Storage space not found" });
      return;
    }

    const currentDate = new Date();
    const expirationdate = new Date(expirationDate);
  
    if (expirationdate <= currentDate) {
      res.status(400).json({ error: "Expiration date must be in the future" });
      return;
    }

    const totalItem = await Item.countDocuments({ storageSpaceId});

    const totalmaxLimit=storageSpace.maxLimit;
    const totalRefrigerate=storageSpace.refrigerate;
       
    const totalItemsInRefrigeration = await Item.countDocuments({
      storageSpaceId: storageSpaceId,
      itemTypeId: itemTypeId,
    });
       
    const availableRefrigerateSpace = totalRefrigerate - totalItemsInRefrigeration;
    const availableMaxLimit = totalmaxLimit - totalItem ;
    logger.info(totalRefrigerate)
    logger.info(totalItemsInRefrigeration)
    logger.info(totalItem)
    logger.info(totalmaxLimit)
    logger.info(availableMaxLimit)
    logger.info(availableRefrigerateSpace)
    if (itemtype.isRefrigeration && availableRefrigerateSpace <= 0) {
      res.status(400).json({ error: "No available space for refrigerated items" });
      return;
    }
    if(itemtype.isRefrigeration && availableMaxLimit<=0){
      res.status(400).json({
        error:"No space for items .Reached maxlimit"
      })
      return;
    }
    

    if (!itemtype.isRefrigeration && availableMaxLimit <= 0) {
      res.status(400).json({ error: "No available space for items. Reached max limit" });
      return;
    }

    const newItem = new Item({ name, itemTypeId, storageSpaceId, expirationDate });
    await newItem.save();
   

        res.status(201).json({ successs: true, newItem, storageSpace: storageSpace.name, itemtype: itemtype.name });

  } catch (error) {
    logger.error("Failed to create item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/relocateItem:
 *   post:
 *     summary: Relocate an item to a new storage space
 *     description: Relocate an existing item to a new storage space
 *     parameters:
 *       - in: body
 *         name: relocationData
 *         description: The relocation data object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             itemId:
 *               type: string
 *             destinationstorageSpaceId:
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully relocated the item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                 item:
 *                   $ref: '#/components/schemas/Item'
 *                 destinationStorageName:
 *                   type: string
 *       400:
 *         description: Item not found, new storage space not found, or no available space for items
 *       500:
 *         description: Internal server error
 */
export const Relocateitem = async (req: Request, res: Response) => {
  try {

    const { itemId, destinationstorageSpaceId } = req.body;
    const item = await Item.findById(itemId);

    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    const destStorageSpace = await StorageSpace.findById(destinationstorageSpaceId);
    
    if (!destStorageSpace) {
      res.status(404).json({ error: "New storage space not found" });
      return;
    }
    
    if (item.storageSpaceId.toString() === destStorageSpace._id.toString()) {
      res.status(400).json({ error: "Item is already present in the destination storage space" });
      return;
  }
  
    const itemType = await ItemType.findById(item.itemTypeId);
    if (!itemType) {
      res.status(400).json({ error: "Item type not found" });
      return;
    }
    const totalItem = await Item.countDocuments({ storageSpaceId: destinationstorageSpaceId });

const totalmaxLimit=destStorageSpace.maxLimit;
const totalRefrigerate=destStorageSpace.refrigerate;
   
const totalItemsInRefrigeration = await Item.countDocuments({
  storageSpaceId: destinationstorageSpaceId,
  itemTypeId: itemType._id,
});
   
const availableRefrigerateSpace = totalRefrigerate - totalItemsInRefrigeration;
const availableMaxLimit = totalmaxLimit - totalItem ;
logger.info(totalRefrigerate)
logger.info(totalItemsInRefrigeration)
logger.info(totalItem)
logger.info(totalmaxLimit)
logger.info(availableMaxLimit)
logger.info(availableRefrigerateSpace)
if(itemType.isRefrigeration && availableRefrigerateSpace<=0){
  res.status(400).json({
    error:"No space for Refrigerated items"
  })
  return;
}

if(itemType.isRefrigeration && availableMaxLimit<=0){
  res.status(400).json({
    error:"No space for items .Reached maxlimit"
  })
  return;
}

if(!itemType.isRefrigeration && availableMaxLimit<=0){
  res.status(400).json({
    error:"No space for items .Reached maxlimit"
  })
  return;
}

    item.storageSpaceId = destinationstorageSpaceId;
    await item.save();
    res.json({ success: "ItRelocated to new storage space",item,destinationStorageName: destStorageSpace.name });
  } catch (error) {
    logger.error("Failed Relocate item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/deleteItem/{id}:
 *   delete:
 *     summary: Delete an item
 *     description: Delete an existing item by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the item to be deleted
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 item:
 *                   $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
export const deleteItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      res.status(404).json({ message: "item not found" });
    }
    await Item.findByIdAndDelete(id);
    res.json({success:"item is deleted",item });
  } catch (error) {
    logger.error("Failed to delete item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/changeItem/{id}:
 *   put:
 *     summary: Change an item
 *     description: Change an existing item by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the item to be changed
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: itemData
 *         description: The item data object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             itemTypeId:
 *               type: string
 *             expirationDate:
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully changed the item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *       400:
 *         description: Item not found or not allowed to change item
 *       500:
 *         description: Internal server error
 */
export const changeItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { itemTypeId, expirationDate } = req.body;
    const item = await Item.findById(id);
    if (!item) {
      res.status(404).json({ message: "item not found" });
      return;
    }
    if(itemTypeId!=item.itemTypeId ||expirationDate !== item.expirationDate.toISOString()){
res.status(400).json({success:"not allowed",item})
    }
    res.json({success:"Not allowed" });
  } catch (error) {
    logger.error("Failed to delete item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
/**
 * @swagger
 * /getAllItems:
 *   get:
 *     summary: Get all items
 *     description: Get a paginated list of all items
 *     parameters:
 *       - name: page
 *         in: query
 *         description: The page number
 *         schema:
 *           type: integer
 *         default: 1
 *       - name: pageSize
 *         in: query
 *         description: The number of items per page
 *         schema:
 *           type: integer
 *         default: 4
 *     responses:
 *       200:
 *         description: Successfully fetched the items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */

export const getallItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1; 
    const pageSize = 4;
    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);
    const count = await Item.find({}).countDocuments();
    const items = await Item.find().sort({ expirationDate: 1 }).skip(skip).limit(limit);
    const totalPages = Math.ceil(count / limit);
    res.json({
      items,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages,
    });
  } catch (error) {
    logger.error("Failed to get items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

