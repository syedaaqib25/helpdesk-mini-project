import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

dotenv.config();
const allowedOrigins = [
  "http://localhost:5173",
  "https://helpdesk-mini-project.vercel.app"
];
const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('🐒🐽Helpdesk Ticketing System API');
});
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// // --- Production Deployment ---
// if (process.env.NODE_ENV === 'production') {
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);
  
//   const clientBuildPath = path.join(__dirname, '../../client/dist');
//   app.use(express.static(clientBuildPath));

//   app.get('*', (req, res) => {
//     res.sendFile(path.join(clientBuildPath, 'index.html'));
//   });
// }

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));