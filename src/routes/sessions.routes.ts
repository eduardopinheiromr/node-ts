import { response, Router } from "express";
import knex from "../database/connection";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
require("dotenv").config();

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

  const token = sign({}, process.env.JWT_TOKEN as string, {
    subject: String(user.id),
    expiresIn: "1d",
  });

  const auth = {
    id: user.id,
    name: user.name,
    email: user.email,
    token,
  };

  return res.json(auth);
});

export default sessionsRouter;
