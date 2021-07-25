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

app.use("/public", express.static(path.resolve(__dirname, "..", "uploads")));

app.use((req, res, next) => {
  const { method, url } = req;

  console.log(
    `\n[${method}] at http://localhost:3000${url} - ${new Date().toLocaleString()}`
  );
  next();
});

app.use(routes);

app.listen(port, () =>
  console.log(
    "\n\n\nListening on port http://localhost:" +
      port +
      "\n\n\n\n\n\n\nServer started at " +
      new Date().toLocaleString() +
      "\n"
  )
);
