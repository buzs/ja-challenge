import type { Handler } from "express";

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
