import express from "express";
import { createItem, Relocateitem, deleteItem, getallItems } from "../controllers/Items";

const router = express.Router();

router.post("/createItem", createItem);
router.put("/relocateItem", Relocateitem);
router.delete("/deleteItem/:id", deleteItem);
router.get("/item", getallItems);

export default router;