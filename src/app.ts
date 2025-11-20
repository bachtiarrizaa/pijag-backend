import expres from "express";
import dotenv from "dotenv";
import routes from "./routes"

dotenv.config();

const app = expres();

app.use(expres.json());
app.use(expres.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Pijag Coffee API running");  
});

app.use("/api", routes)

export default app;