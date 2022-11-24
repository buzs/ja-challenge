import type { Handler } from "express";
import type { CepLocation } from "../../types/ViaCepApi";

import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const index: Handler = async (req, res) => {
  const project = await prisma.project.findUnique({
    where: {
      id: String(req.params.id),
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  if (project) {
    const { user, userId, ...rest } = project;

    try {
      const location = await axios.get<CepLocation>(
        `https://viacep.com.br/ws/${project.zip_code}/json/`
      );

      return res.status(200).json({
        ...rest,
        username: user.username,
        city: location.data.localidade,
        state: location.data.uf,
      });
    } catch (e) {
      return res.status(200).json({
        ...rest,
        username: user.username,
        city: "Unknown",
        state: "Unknown",
      });
    }
  }

  return res.status(404).json({ message: "Project not found" });
};

export const list: Handler = async (req, res) => {
  const projects = await prisma.project.findMany({
    where: {
      user: {
        username: req.headers.username as string,
      },
    },
  });

  if (projects) {
    return res.status(200).json(projects);
  }

  return res.status(400).json({ message: "Projects not found" });
};

export const create: Handler = async (req, res) => {
  const project = await prisma.project.create({
    data: {
      title: req.body.title,
      zip_code: req.body.zip_code,
      deadline: req.body.deadline,
      cost: req.body.cost,
      user: {
        connect: {
          username: req.headers.username as string,
        },
      },
    },
  });

  if (project) {
    return res.status(201).json(project);
  }

  return res.status(400).json({ message: "Project not created" });
};

export const done: Handler = async (req, res) => {
  const project = await prisma.project.findUnique({
    where: {
      id: String(req.params.id),
    },
    include: {
      user: true,
    },
  });

  if (!project) {
    return res.status(400).json({ message: "Project not found" });
  }

  if (project.user.username !== req.headers.username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const projectDone = await prisma.project.update({
    where: {
      id: String(req.params.id),
    },
    data: {
      done: true,
    },
  });

  if (projectDone) {
    return res.status(200).json({ message: "Project changed to done" });
  }

  return res.status(400).json({ message: "Project not changed" });
};

export const update: Handler = async (req, res) => {
  console.log(req.body);
  const project = await prisma.project.findUnique({
    where: {
      id: String(req.params.id),
    },
    include: {
      user: true,
    },
  });

  if (!project) {
    return res.status(400).json({ message: "Project not found" });
  }

  if (project.user.username !== req.headers.username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: String(req.params.id),
    },
    data: {
      title: req.body.title,
      zip_code: req.body.zip_code,
      deadline: req.body.deadline,
      cost: req.body.cost,
    },
  });

  if (updatedProject) {
    return res.status(200).json(updatedProject);
  }

  return res.status(400).json({ message: "Project not updated" });
};

export const remove: Handler = async (req, res) => {
  const project = await prisma.project.findUnique({
    where: {
      id: String(req.params.id),
    },
    include: {
      user: true,
    },
  });

  if (!project) {
    return res.status(400).json({ message: "Project not found" });
  }

  if (project.user.username !== req.headers.username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const deletedProject = await prisma.project.delete({
    where: {
      id: String(req.params.id),
    },
  });

  if (deletedProject) {
    return res.status(200).json(deletedProject);
  }

  return res.status(400).json({ message: "Project not deleted" });
};
