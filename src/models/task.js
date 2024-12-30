import mongoose from "mongoose";

const collectionName = "task";

const collectionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: String,
  estado: Boolean,
  fecha: Date,
});

const taskModel = mongoose.model(collectionName, collectionSchema);
export default taskModel;
