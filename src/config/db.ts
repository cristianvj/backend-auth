import mongoose from 'mongoose';	
import colors from 'colors';
import { exit, env } from 'process';

export const connectDB = async () => {
  try{
    const { connection } = await mongoose.connect(env.MONGO_URI);
    const url = `${connection.host} : ${connection.port}`;
    console.log(colors.bgCyan.bold(`MongoDB connected at ${url}`));
  } catch(error) {
    console.log(colors.bgRed.white.bold("Error to DB connect: "), error);
    exit(1);
  };
};