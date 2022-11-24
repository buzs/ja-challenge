import type { Handler } from "express";

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const index: Handler = async (req, res) => {
  const users = await prisma.user.findMany();
  return res.status(200).json(users);
};

export const create: Handler = async (req, res) => {
  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
    },
  });

  if (user) {
    return res.status(201).json(user);
  }

  return res.status(400).json({ message: "User not created" });
};

export const login: Handler = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

  if (!passwordIsValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const { password, id, ...userWithoutPassword } = user;

  return res.status(200).json(userWithoutPassword);
};
