import { response, Router } from "express";
import knex from "../database/connection";
import { hash } from "bcryptjs";

const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
  const users = await knex("users");

  return res.json(users);
});

usersRouter.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  const passwordHashed = await hash(password, 8);

  const user = { name, email, password: passwordHashed };

  const newIds = await knex("users").insert(user);

  return res.json({
    id: newIds[0],
    ...user,
  });
});

export default usersRouter;
