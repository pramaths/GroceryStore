import { Request, Response } from "express";
import ItemType,{ItemTypeDocument} from "../models/ItemTypes";
import winston from "winston";
import Item from "../models/Items";
const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});
/**
 * @swagger
 * /api/createItemType:
 *   post:
 *     summary: Create a new item type
 *     description: Create a new item type with the provided details
 *     parameters:
 *       - in: body
 *         name: itemType
 *         description: The item type object to create
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             isRefrigeration:
 *               type: boolean
 *     responses:
 *       201:
 *         description: Successfully created a new item type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemType'
 *       400:
 *         description: Item name already exists
 *       500:
 *         description: Internal server error
 */
export const createItemType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, isRefrigeration } = req.body;
    const existingType = await ItemType.findOne({ name });
    if (existingType) {
      res.status(400).json({ info: "Item name already exists" });
      return;
    }
    const NewItemType = new ItemType({
      name,
      isRefrigeration,
    });
    await NewItemType.save();
    res.status(201).json({ NewItemType });
  } catch (error) {
    logger.error("failed to create item type");
    res.status(500).json({ error: "internal server error" });
  }
};

/**
 * @swagger
 * /api/renameItemType/{id}:
 *   put:
 *     summary: Rename an item type
 *     description: Rename an existing item type
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the item type to be renamed
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: newname
 *         description: The new name for the item type
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully renamed the item type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 existingType:
 *                   $ref: '#/components/schemas/ItemType'
 *       404:
 *         description: Item type not found or new name already exists
 *       500:
 *         description: Internal server error
 */
export const renameItemType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existingType = await ItemType.findOne({ _id: id });
    if (!existingType) {
      res.status(404).json({ info: "itemptype not found" });
      return;
    }
    const exist = await ItemType.findOne({ _id: { $ne: id }, name });
    if (exist) {
      res.status(400).json({ info: "Name alreay taken" });
      return;
    }
    existingType.name = name;
    await existingType.save();
    res.json({ existingType });
  } catch (error) {
    logger.error("failed to rename itemtype");
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/deleteItemType/{id}:
 *   delete:
 *     summary: Delete an item type
 *     description: Delete an existing item type by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the item type to be deleted
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the item type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Item type not found
 *       500:
 *         description: Internal server error
 */
export const deleteItemType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const existingType = await ItemType.findById(id);
    if (!existingType) {
      res.status(409).json({ info: "Item type not found" });
      return;
    }
    const items = await Item.countDocuments({ itemTypeId: id });
    if (items > 0) {
      res.status(400).json({
        Info: "You can't delete the storage space because items are associated with it",
      });
      return;
    }
    await ItemType.findByIdAndDelete(id);
    res.json({ message: "Item type deleted",existingType });
  } catch (error) {
    logger.error("Failed to delete item type", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

