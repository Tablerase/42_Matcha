import "module-alias/register";
import express, { Request, Response, Application } from "express";
import { ErrorRequestHandler, RequestHandler } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "@routes/authRoutes";
import userRoutes from "@routes/userRoutes";
import { authenticateToken } from "./middleware/auth";
import { serverPort } from "./settings";

const app: Application = express();

// Middleware with proper typing
app.use(bodyParser.json() as RequestHandler);
app.use(
  bodyParser.urlencoded({
    extended: true,
  }) as RequestHandler
);
app.use(cors() as RequestHandler);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
};

// Public Routes
app.get("/", (_req: Request, res: Response): void => {
  res.json({ info: "Welcome to Matcha API" });
});
app.use("/auth", authRoutes as RequestHandler);

// Protected Routes
app.use(
  "/users",
  authenticateToken as RequestHandler,
  userRoutes as RequestHandler
);

// Error handler should be last
app.use(errorHandler);

// Start server
app.listen(serverPort, (): void => {
  console.log(`Server running on port ${serverPort}`);
});

export default app;
