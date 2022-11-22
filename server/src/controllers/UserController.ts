import type { Handler } from "express";

export const create: Handler = (req, res) => {
  res.send("Hello World!");
};
