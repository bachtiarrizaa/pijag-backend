import expres from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes"
import { errorMiddleware } from "./middleware/error.middleware";

dotenv.config();

const app = expres();

app.use(expres.json());
app.use(expres.urlencoded({ extended: true }))
app.use(cors());
app.get("/", (req, res) => {
  res.send("Pijag Coffee API running");  
});

app.use("/api", routes)

app.use(errorMiddleware);

export default app;