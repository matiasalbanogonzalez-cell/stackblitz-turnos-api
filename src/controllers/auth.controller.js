import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTRO
export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // verificar si ya existe
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nombre,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // generar token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      "secreto123", // luego usar .env
      {
        expiresIn: "1h"
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};