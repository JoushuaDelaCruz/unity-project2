import express from "express";
import bodyParser from "body-parser";
import expressSession from "express-session";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import "./configs/dotenvConfig.js";
import { sessionConfig } from "./configs/sessionConfig.js";
import { corsOptions } from "./configs/corsConfig.js";
import { hash, compare, genSaltSync } from "bcrypt";
import {
  register,
  login,
  updateScore,
  getScore,
} from "./database/db_authentication.js";

const app = express();
const port = process.env.PORT || 3100;
const hashSalt = genSaltSync(12);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressSession(sessionConfig));
app.use(express.static(path.join(__dirname, "/")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, +"/index.html"));
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (password.length <= 10 || username.length < 1) {
    res.status(403).send();
    return;
  }
  if (!password.match(/[a-z]/)) {
    res.status(403).send();
    return;
  }
  if (!password.match(/[A-Z]/)) {
    res.status(403).send();
    return;
  }
  if (!password.match(/[0-9]/)) {
    res.status(403).send();
    return;
  }
  if (!password.match(/[^a-zA-Z\d]/)) {
    res.status(403).send();
    return;
  }
  const hashedPassword = await hash(password, hashSalt);
  const result = await register(username, hashedPassword);
  if (result) {
    res.status(200).send();
    return;
  } else {
    res.status(403).send();
    return;
  }
});

app.get("/user", async (req, res) => {
  if (req.session.username) {
    res.status(200).send(req.session.username);
    return;
  }
  res.sendStatus(403).send(null);
});

app.post("/score", async (req, res) => {
  if (!req.session.authenticated) {
    res.status(403).send();
    return;
  }
  const { score } = req.body;
  const { user_id } = req.session;
  const result = await updateScore(user_id, parseInt(score));
  if (result) {
    res.status(200).send();
    return;
  } else {
    res.status(403).send();
    return;
  }
});

app.put("/gameOver", async (req, res) => {
  if (!req.session.authenticated) {
    res.status(403).send();
    return;
  }
  const { user_id } = req.session;
  const result = await updateScore(user_id, 0);
  if (result) {
    res.status(200).send();
    return;
  } else {
    res.status(403).send();
    return;
  }
});

app.get("/score", async (req, res) => {
  const { user_id } = req.session;
  const { score } = await getScore(user_id);
  if (score) {
    res.status(200).send(`${score}`);
    return;
  } else {
    res.status(403).send();
    return;
  }
});

app.get("/checkSession", async (req, res) => {
  try {
    if (req.session.authenticated) {
      res.status(200).send();
      return;
    }
    res.status(201).send();
  } catch (e) {
    res.status(201).send();
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await login(username);
  if (result) {
    const isValid = await compare(password, result.password);
    if (isValid) {
      req.session.authenticated = true;
      req.session.username = username;
      req.session.user_id = result.user_id;
      res.status(200).send();
      return;
    } else {
      res.status(403).send();
      return;
    }
  }
  res.status(403).send();
});

app.listen(port, () => {
  console.log(`Connected to port ${port}`);
});
