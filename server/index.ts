import express from 'express';
import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { startSimulation } from './simulate.js';
import { registerSocketHandlers } from './socketHandlers.js';
import { generateLocalCert } from './certGenerator.js';
import { authRouter } from './auth.js';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app = express();

// 1. Security Headers & Payload Compression
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:3001", "ws://localhost:3001", "https://neurovenue.onrender.com", "wss://neurovenue.onrender.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"]
    }
  }
}));
app.use(compression());

// 2. Strong CORS logic (avoiding open '*' in production scenarios)
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://your-production-domain.com',
      'https://neurovenue.onrender.com', // Let backend allow itself if serving UI
      // Allow typical production frontend host URLs to be added later via ENV
    ]
  : ['http://localhost:5173', 'https://localhost:5173', 'https://neurovenue.onrender.com'];
  
// Additionally allow frontends dynamically if provided via ENV
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST']
}));

// 3. API Rate Limiting to prevent basic DDoS and brute-force
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/', apiLimiter);

app.use(express.json());

// 4. Attach API Routers targeting JWT Auth
app.use('/api/auth', authRouter);

// Load Certs if available for HTTPS functionality
const certs = generateLocalCert();
const httpServer = certs ? createHttpsServer(certs, app) : createHttpServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

// Start the venue simulation loop
startSimulation(io);

// 5. Socket.io JWT Middleware Enforcement
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication Error: Missing JWT Token'));
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
    if (err) return next(new Error('Authentication Error: Invalid JWT Token'));

    // Attach decoded user specifically to socket context
    socket.data.user = decoded;
    next();
  });
});

import { venueState } from './state.js';

// Handle new incoming socket connections
io.on('connection', (socket) => {
  registerSocketHandlers(io, socket, venueState);
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`NeuroVenue Real-time Backend running on ${certs ? 'https' : 'http'}://0.0.0.0:${PORT}`);
});
