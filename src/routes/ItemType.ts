import express from "express";
import { createItemType, renameItemType, deleteItemType } from "../controllers/ItemType";

const router = express.Router();

router.post("/createItemType", createItemType);
router.put("/renameItemType/:id", renameItemType);
router.delete("/deleteItemType/:id", deleteItemType);

export default router;