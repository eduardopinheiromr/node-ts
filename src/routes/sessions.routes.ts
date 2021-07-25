import { response, Router } from "express";
import knex from "../database/connection";
import { compare } from "bcryptjs";

const sessionsRouter = Router();

sessionsRouter.post("/", async (req, res) => {
  const { email, password } = req.body;

  const user = await knex("users").where("email", email).first();

  if (!user) {
    return response.status(400).json({ message: "Invalid credentials" });
  }

  const comparePassword = await compare(password, user.password);

  if (!comparePassword) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  return res.json({ user });
});

export default sessionsRouter;
