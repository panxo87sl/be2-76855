import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      unique: true, //? El correo debe ser único
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.githubid;
      }, //? Esta funcion evita el password si es que se usa github
    },
    githubid: {
      type: String,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carts", //? Referencia a la colección "Carts" para el futuro
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", //? Valor por defecto si no se indica
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
