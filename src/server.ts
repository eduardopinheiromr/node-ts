import express from "express";
import routes from "./routes";
import path from "path";
import cors from "cors";

const app = express();
const port = 3000;

// TO ALLOW REQUESTS TO ALL DOMAINS
app.use(cors());

// TO ALLOW REQUESTS ONLY DOMAINS YOU WANT
// app.use(cors({
//   origin: 'domain.com'
// }));

app.use(express.json());

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.use(routes);

app.listen(port, () =>
  console.log("Listening on port http://localhost:" + port)
);
