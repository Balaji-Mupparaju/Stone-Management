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

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally OR a hosted MongoDB Atlas connection string
- A terminal (PowerShell on Windows is fine)

### Environment Variables
Two example files are included:
- `back-end/.env.example`
- `front-end/.env.example`

Copy them and rename to `.env` in each folder. Adjust values as needed.

Backend `.env` expected variables:
```
PORT=3000
MONGO_CONNECTION_STRING=mongodb://localhost:27017/stone_management
NODE_ENV=development
```

Frontend `.env` expected variable:
```
REACT_APP_API_URL=http://localhost:3000
```

### Backend Setup (Express + MongoDB)
1. Open a terminal and move to the backend directory:
   ```powershell
   cd back-end
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Create `.env` from example (PowerShell):
   ```powershell
   Copy-Item .env.example .env
   ```
   Edit `.env` and change `MONGO_CONNECTION_STRING` if using Atlas.
4. Start development server with auto‑reload:
   ```powershell
   npm run dev
   ```
   Or for a production style run:
   ```powershell
   npm start
   ```
5. The API will be available at `http://localhost:3000`.

### Frontend Setup (React)
1. In a second terminal:
   ```powershell
   cd front-end
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Create `.env` from example:
   ```powershell
   Copy-Item .env.example .env
   ```
   Ensure `REACT_APP_API_URL` matches backend host/port.
4. Start the React dev server:
   ```powershell
   npm start
   ```
5. Open `http://localhost:3000` if CRA picked port 3000, or if it detects the backend using 3000 it will prompt to use the next free port (e.g. 3001). Accept the prompt. The UI will call the backend using `REACT_APP_API_URL`.

### Running Both (Optional Single Command)
You can open two terminals (one for backend, one for frontend). If you prefer a single root script, add a `package.json` at repo root and use `concurrently` (not included yet). Future enhancement: root script `npm run dev` starting both.

### Common Issues
- 404 / Network errors: Ensure `REACT_APP_API_URL` matches backend and CORS headers are set (already enabled in backend `src/app.js`).
- Mongo connection errors: Confirm Mongo service is running or Atlas URI is correct (includes username/password and `retryWrites=true&w=majority`).
- Environment variable not picked up in frontend: Only variables prefixed with `REACT_APP_` are exposed. Restart dev server after changes.

### Quick Verification Checklist
1. Backend terminal shows: `✅ Database connected successfully` and `🚀 Server listening on port 3000`.
2. Frontend loads list view without console fetch errors.
3. Adding a stone succeeds and appears in inventory.
4. Editing a stone validates that type rows cannot be empty.

### Recommended Next Enhancements
- Add root `package.json` with `concurrently` dev script.
- Add ESLint + Prettier config for consistent formatting.
- Implement request logging (morgan) in backend for debugging.
- Add production build instructions with Docker.

### Windows PowerShell Tips
- Use `Remove-Item .env` to delete, `Get-Content .env` to view.
- Quote values with special characters: `MONGO_CONNECTION_STRING="mongodb+srv://user:pass@cluster/mydb"` (in `.env` plain quotes are optional unless value includes spaces).

---
You are now ready to develop locally.

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

## Progressive Web App (PWA)

The front-end is PWA-enabled so you can install it and use limited functionality offline.

### What Was Added
- Updated `public/manifest.json` with proper metadata (name, short_name, theme colors, maskable icons).
- Custom service worker (`src/service-worker.js`) that precaches app shell, caches API responses (network-first), and serves `offline.html` when offline.
- Offline fallback page (`public/offline.html`).
- Automatic service worker registration in `src/index.js` after window load.

### Install Instructions
1. Build the app:
   ```powershell
   cd front-end
   npm run build
   ```
2. Serve the build folder (example):
   ```powershell
   npx serve -s build
   ```
3. Open in Chrome/Edge. Use the browser menu or install icon in the address bar to install.

### Offline Behavior
- Previously visited static resources load from cache.
- Navigations without connectivity fall back to `offline.html`.
- API requests: network-first; if offline and cached, returns cached; otherwise offline page.

### Updating The App
Deploy new build -> service worker updates in background. To force immediate activation, send:
```js
if (navigator.serviceWorker?.controller) {
  navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
}
```
Then refresh the page.

### Troubleshooting
| Issue | Fix |
|-------|-----|
| Install button missing | Ensure HTTPS (or localhost), manifest + service worker load without errors. |
| Old content served | Hard refresh (Ctrl+Shift+R) or bump CACHE_VERSION in `service-worker.js`. |
| Offline page not triggered | Confirm `offline.html` is precached and fetch handler logic unchanged. |
| API data unavailable offline | Endpoint must be fetched online at least once to become cached. |

### Customize
- Change icons/colors in `manifest.json`.
- Adjust caching strategy in `service-worker.js`.
- Edit offline UI in `offline.html`.
