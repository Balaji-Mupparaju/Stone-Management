import express from "express";
import StoneController from "../controllers/stone.js";

const router = express.Router();

router.post("/addStone", StoneController.addStone);
router.get("/getAllStones", StoneController.getAllStones);
router.get("/getStone/:id", StoneController.getStoneById);
router.put("/updateStone/:id", StoneController.updateStone);
router.delete("/deleteStone/:id", StoneController.deleteStone);

export default router;
