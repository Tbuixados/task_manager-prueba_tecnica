import express from "express";
import mongoose from "mongoose";
import router from "../routes/taskRouter.js";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerSpecs from "../../swagger/swagger.js";

const corsOptions = {
  origin: "*",
};

const app = express();
const port = process.env.PORT || 9090;
app.use(express.json());
app.use(cors(corsOptions));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

app.use("/api/tasks", router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const url_mongo = `mongodb+srv://buixadostomas:ptJrYu9HE9k2UMQv@cluster0.y1lfs.mongodb.net/pruebaTecnicaCoally?retryWrites=true&w=majority&appName=Cluster0`;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(url_mongo);
    console.log("Connected to Mongo Success");
  } catch (error) {
    console.error(`Error to connect to DB: ${error}`);
  }
};

connectMongoDB();
