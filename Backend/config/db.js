import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "snippetDB",
    });
    console.log("MongoDB Connected ✔");
  } catch (err) {
    console.error("Mongo Error ❌", err);
  }
};

export default connectDB;
