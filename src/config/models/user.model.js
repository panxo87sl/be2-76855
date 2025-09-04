import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true, //? El correo debe ser único
    required: true,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts", //? Referencia a la colección "Carts" para el futuro
  },
  role: {
    type: String,
    default: "user", //? Valor por defecto si no se indica
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
