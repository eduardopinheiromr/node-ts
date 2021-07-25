import express from "express";
import routes from "./routes";
import path from "path";

const app = express();
const port = 3000;

app.use(routes);

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.listen(port, () =>
  console.log("Listening on port http://localhost:" + port)
);
