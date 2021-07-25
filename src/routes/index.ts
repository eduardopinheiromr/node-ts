import { Router } from "express";

const routes = Router();

routes.get("/", (req, res) => res.send("Home"));

export default routes;
