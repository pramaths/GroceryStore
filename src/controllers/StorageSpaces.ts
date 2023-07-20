import { Request, Response } from "express";
import StorageSpace from "../models/StorageSpace";
import winston from "winston";
import Item from "../models/Items";
const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});
/**
 * @swagger
 * /api/createstorage:
 *   post:
 *     summary: Create a new storage space
 *     description: Create a new storage space with the provided details
 *     parameters:
 *       - in: body
 *         name: storageSpace
 *         description: The storage space object to create
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             maxLimit:
 *               type: number
 *             refrigerate:
 *               type: number
 *     responses:
 *       201:
 *         description: Successfully created a new storage space
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StorageSpace'
 *       500:
 *         description: Internal server error
 */
export const createstorage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, maxLimit, refrigerate } = req.body;
    if(maxLimit<refrigerate){
      res.status(400).json({error:"it is not possible"})
    }
    const storagespace = new StorageSpace({
      name,
      maxLimit,
      refrigerate,
    });
    await storagespace.save();
    res.status(201).json(storagespace);
  } catch (error) {
    logger.error("failed to create", error);
  }
};
/**
 * @swagger
 * /api/renamestorage/{oldname}:
 *   put:
 *     summary: Rename a storage space
 *     description: Rename an existing storage space
 *     parameters:
 *       - in: path
 *         name: oldname
 *         description: The current name of the storage space to be renamed
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: newname
 *         description: The new name for the storage space
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             newname:
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully renamed the storage space
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *       404:
 *         description: Storage space not found or new name already exists
 *       500:
 *         description: Internal server error
 */
export const renamestorage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { oldname } = req.params; // here we can use mongodb oject id just for understanding using name
    const { newname } = req.body;
    const exist = await StorageSpace.findOne({ name: newname });
    if (exist) {
      res.status(404).json({ message: "No buddy we can't chnage" });
    }
    const storagespace = await StorageSpace.findOne({ name: oldname });
    if (!storagespace) {
      res.status(404).json({ message: "storage space does not exist" });
      return;
    }

    storagespace.name = newname;
    await storagespace.save();
    res.status(200).json({ name: storagespace.name });
  } catch (error) {
    logger.error("failed to rename");
    res.status(500).json({ message: "server error" });
  }
};

/**
 * @swagger
 * /api/deletestorage/{id}:
 *   delete:
 *     summary: Delete a storage space
 *     description: Delete an existing storage space by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the storage space to be deleted
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the storage space
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 info:
 *                   type: string
 *                 storagespace:
 *                   $ref: '#/components/schemas/StorageSpace'
 *       404:
 *         description: Storage space not found or cannot be deleted due to associated items
 *       500:
 *         description: Internal server error
 */
export const deletestorage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const storagespace = await StorageSpace.findById(id);
    if (!storagespace) {
      res.status(404).json({ Info: "Storage space not found" });
      return;
    }

    const items = await Item.countDocuments({ storageSpaceId: id });
    if (items > 0) {
      res.status(400).json({
        Info: "You can't delete the storage space because items are associated with it",
      });
      return;
    }

    await StorageSpace.findByIdAndDelete(id);
    res.json({ success: true, info: "Storage space deleted successfully",storagespace });
  } catch (error) {
    logger.error("Failed to delete storagespace", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


/**
 * @swagger
 * /api/getallitems/{id}:
 *   get:
 *     summary: Get all items in a storage space
 *     description: Get a list of all items in a storage space by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the storage space to get items from
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the items for the storage space
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *       404:
 *         description: No items found for the given storage space
 *       500:
 *         description: Internal server error
 */
export const getallitems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const items = await Item.find({ storageSpaceId: id }).populate("itemTypeId");
    if (!items) {
      res.status(404).json({ Info: "No items found for the given storage space" });
      return;
    }

    res.status(200).json({ success: true, items });
  } catch (error) {
    logger.error("Failed to display items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
