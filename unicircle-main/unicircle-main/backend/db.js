import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/";

const connectMongo = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to Mongo");
};

export default connectMongo;
