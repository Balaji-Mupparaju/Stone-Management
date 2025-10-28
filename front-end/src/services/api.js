// Default to backend port 3000 (matches backend .env). You can override with REACT_APP_API_URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

class ApiService {
  async getAllStones() {
    try {
      const response = await fetch(`${API_BASE_URL}/stones/getAllStones`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server error: ${response.status} - ${errorText || 'No error details available'}`
        );
      }

      const data = await response.json();
      if (!data) {
        throw new Error('No data received from server');
      }
      return data;
    } catch (error) {
      console.error('Error fetching stones:', error);
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  async getStoneById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/stones/getStone/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stone by ID:', error);
      throw error;
    }
  }

  async addStone(stoneData) {
    try {
      const response = await fetch(`${API_BASE_URL}/stones/addStone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stoneData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding stone:', error);
      throw error;
    }
  }

  async updateStone(id, stoneData) {
    try {
      const response = await fetch(`${API_BASE_URL}/stones/updateStone/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stoneData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating stone:', error);
      throw error;
    }
  }

  async deleteStone(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/stones/deleteStone/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting stone:', error);
      throw error;
    }
  }
}

export default new ApiService();
