# Stone Management System

A full-stack application for managing stone inventory with detailed tracking of costs, cutting, and polishing information.

## Features

- **Backend API**: Node.js/Express server with MongoDB
- **Frontend**: React application with modern UI
- **Stone Management**: Add, view, edit, and delete stone records
- **Detailed Tracking**: Track stone costs, cutting details, polishing information, and sales data

## Backend API Endpoints

- `GET /stones/getAllStones` - Get all stones
- `GET /stones/getStone/:id` - Get stone by ID
- `POST /stones/addStone` - Add new stone
- `PUT /stones/updateStone/:id` - Update stone
- `DELETE /stones/deleteStone/:id` - Delete stone

## Stone Data Structure

Each stone contains:
- Basic info: status, name, bought from, estimated feet, costs
- Cutting details: feet, cost per feet
- Polishing details: feet, cost per feet
- Stone types array with type, feet, estimated cost, sold cost
- Sales info: marker name, phone number

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd back-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your MongoDB connection string:
   ```
   MONGO_CONNECTION_STRING=your_mongodb_connection_string
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd front-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3001`

## Usage

1. Start both backend and frontend servers
2. Open your browser and go to `http://localhost:3001`
3. The application will automatically fetch all stones from the backend
4. Use the "ADD STONE +" button to add new stones (functionality to be implemented)
5. Click "Open" on any stone card to view detailed information
6. Use "REFRESH" to reload the stone list
7. Click "Delete" to remove stones from the database

## API Integration

The frontend uses the `ApiService` class located in `front-end/src/services/api.js` to communicate with the backend. All API calls are properly handled with error management and loading states.

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React, React Router
- **Styling**: Inline CSS with modern responsive design
