import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
async function connect() {
    console.log('hello');
    
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB ');
    return db;
  }

  export default connect;