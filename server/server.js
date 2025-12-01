import express from "express";
import cors from "cors";
import { connectDb } from "./config/database.js";
import userRouter from "./routes/user.Routes.js";
import dotenv from "dotenv";
import { handleDemo } from "./routes/demo.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDb();


app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Nodejs Authentication Tutorial");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
