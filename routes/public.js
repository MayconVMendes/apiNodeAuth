import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/cadastro", async (req, res) => {
  try {
    const user = req.body;

    //Falando qual o peso da criptografia
    const salt = await bcrypt.genSalt(10);

    //Aplicando a criptografia na senha
    const hashPassword = await bcrypt.hash(user.password, salt);

    const userDB = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashPassword,
      },
    });

    res.status(201).json(userDB);
  } catch (err) {
    res.status(500).json({ message: "Erro no Servidor, tente novamente" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const userInfo = req.body;

    // Busca o usuário no banco
    const user = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
    });

    // Verifica se o usuário existe no banco
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    //Verifica se a senha não CRIPTOGRAFADA fornecida pelo usuário é a mesma que a do banco que ESTÁ CRIPTOGRAFADA
    const isMatch = await bcrypt.compare(userInfo.password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Senha inválida" });
    }

    //Gerar o Token JWT, informação importante no README
    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json(token);
  } catch (err) {
    res.status(500).json({ message: "Erro no Servidor, tente novamente" });
  }
});

export default router;
