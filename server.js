import "dotenv/config";
import app from "./app.js";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});