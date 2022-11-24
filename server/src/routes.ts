import { Router } from "express";
import { Joi, celebrate, Segments } from "celebrate";

import * as ProjectController from "./controllers/ProjectController";
import * as UserController from "./controllers/UserController";

export const routes = Router();

// User routes

// POST /login
routes.post(
  "/login",
  celebrate({
    [Segments.BODY]: {
      username: Joi.string().required(),
      password: Joi.string().required(),
    },
  }),
  UserController.login
);

// GET /users
routes.get("/users", UserController.index);

// POST /user
routes.post(
  "/users",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  UserController.create
);

// POST /project
routes.post(
  "/project",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required(),
      zip_code: Joi.string().required(),
      deadline: Joi.date().required(),
      cost: Joi.number().required(),
    }),
    [Segments.HEADERS]: Joi.object({
      username: Joi.string().required(),
    }).unknown(),
  }),
  ProjectController.create
);

// GET /projects
routes.get(
  "/projects",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      username: Joi.string().required(),
    }).unknown(),
  }),
  ProjectController.list
);

// GET /project
routes.get("/project/:id", ProjectController.index);

// PUT /projects/:id
routes.put(
  "/projects/:id",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required(),
      zip_code: Joi.string().required(),
      deadline: Joi.date().required(),
      cost: Joi.number().required(),
    }),
    [Segments.HEADERS]: Joi.object({
      username: Joi.string().required(),
    }).unknown(),
  }),
  ProjectController.update
);

// PATCH /projects/:id/done
routes.patch(
  "/projects/:id/done",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      username: Joi.string().required(),
    }).unknown(),
  }),
  ProjectController.done
);

// DELETE /projects/:id
routes.delete(
  "/projects/:id",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      username: Joi.string().required(),
    }).unknown(),
  }),
  ProjectController.remove
);
