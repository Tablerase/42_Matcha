import 'module-alias/register';
import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import userRoutes from "@routes/userRoutes";
import { serverPort } from "../settings";

const app: Application = express();

// Middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Routes
app.get("/", (_req: Request, res: Response): void => {
  res.json({ info: "Welcome to Matcha API" });
});

app.use("/users", userRoutes);

// Start server
app.listen(serverPort, (): void => {
  console.log(`Server running on port ${serverPort}`);
});

export default app;
