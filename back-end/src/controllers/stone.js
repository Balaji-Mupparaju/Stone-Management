import StoneService from '../services/stone.js';

class StoneController {
  // CREATE
  async addStone(req, res) {
    try {
      const newStone = await StoneService.addStone(req.body);
      return res.status(201).json(newStone);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  // READ ALL
  async getAllStones(req, res) {
    try {
      const stones = await StoneService.getAllStones();
      return res.status(200).json(stones);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  // READ ONE
  async getStoneById(req, res) {
    try {
      const stone = await StoneService.getStoneById(req.params.id);
      if (!stone) {
        return res.status(404).json({ message: "Stone not found" });
      }
      return res.status(200).json(stone);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  // UPDATE
  async updateStone(req, res) {
    try {
      const updatedStone = await StoneService.updateStone(req.params.id, req.body);
      if (!updatedStone) {
        return res.status(404).json({ message: "Stone not found" });
      }
      return res.status(200).json(updatedStone);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  // DELETE
  async deleteStone(req, res) {
    try {
      const deletedStone = await StoneService.deleteStone(req.params.id);
      if (!deletedStone) {
        return res.status(404).json({ message: "Stone not found" });
      }
      return res.status(200).json({ message: "Stone deleted successfully" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export default new StoneController();
