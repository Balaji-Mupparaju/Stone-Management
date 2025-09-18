import StoneData from '../models/stone.js';

class StoneService {
  async addStone(stoneDetails) {
    try {
      const newStone = await StoneData.create(stoneDetails);
      return newStone;
    } catch (error) {
      console.error("Error adding stone:", error);
      throw error;
    }
  }

  async getAllStones() {
    try {
      return await StoneData.find();
    } catch (error) {
      console.error("Error fetching stones:", error);
      throw error;
    }
  }

  async getStoneById(id) {
    try {
      return await StoneData.findById(id);
    } catch (error) {
      console.error("Error fetching stone by ID:", error);
      throw error;
    }
  }

  async updateStone(id, stoneDetails) {
    try {
      const updatedStone = await StoneData.findByIdAndUpdate(id, stoneDetails, { new: true });
      return updatedStone;
    } catch (error) {
      console.error("Error updating stone:", error);
      throw error;
    }
  }

  async deleteStone(id) {
    try {
      return await StoneData.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error deleting stone:", error);
      throw error;
    }
  }
}

export default new StoneService();
