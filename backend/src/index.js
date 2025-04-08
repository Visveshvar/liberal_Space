import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import axios from 'axios'
import cookieParser from 'cookie-parser'
import config from './config/config.js'
import authRoutes from './routes/auth.route.js'
import spaceRoutes from './routes/spaces.route.js'
import { connectDB } from './lib/db.js'
const app = express();
app.use(
  cors({
    origin: [config.clientUrl],
    credentials:true,
  }),
)
app.use(cookieParser())
app.use(express.json()); 

app.use('/auth',authRoutes)
app.use('/space',spaceRoutes)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB()
});