import dotenv from 'dotenv';
import app from './app.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
});