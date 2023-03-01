import express from 'express';
import morgan from 'morgan';
import routes  from "./routes/v1";
import cors from "cors";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(morgan("tiny"));

// v1 api routes
app.use("/", routes);

app.use((err, _req, res, _next) => {
  res.status(500);
  res.json({ error: err.message });
});

export default app;
