import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { connectToDB } from "./config/db.config.js";
import machineRouter from "./routes/machine.routes.js";
import partRouter from "./routes/part.routes.js";

import { userRouter } from "./routes/user.routes.js";

dotenv.config();
connectToDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(`/user`, userRouter);
app.use(`/part`, partRouter);
app.use("/machine", machineRouter);

app.listen(Number(process.env.PORT), () => {
  console.log(`Server up and running at port ${process.env.PORT}`);
});
