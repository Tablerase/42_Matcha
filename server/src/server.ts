import "module-alias/register";
import express, { Request, Response, Application } from "express";
import { ErrorRequestHandler, RequestHandler } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "@routes/authRoutes";
import userRoutes from "@routes/userRoutes";
import { authenticateToken } from "./middlewares/auth";
import tagsRoutes from "@routes/tagsRoutes";
import { SERVER_PORT, FRONTEND_ORIGIN } from "./settings";

const app: Application = express();

// Middleware with proper typing
app.use(cookieParser());
app.use(express.json({ limit: "1mb" })); // for pic upload
app.use(bodyParser.json() as RequestHandler);
app.use(
  bodyParser.urlencoded({
    limit: "1mb",
    extended: true,
  }) as RequestHandler
);
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
};

// Public Routes
const publicRoutes = express.Router();
publicRoutes.get("/", (_req: Request, res: Response) => {
  res.json({ info: "Welcome to Matcha API" });
});
publicRoutes.use("/auth", authRoutes);

// Protected Routes
const protectedRoutes = express.Router();
protectedRoutes.use("/users", userRoutes);
protectedRoutes.use("/tags", tagsRoutes);

// Apply middleware and routes
app.use(publicRoutes);
app.use(authenticateToken as RequestHandler, protectedRoutes);

// Error handler should be last
app.use(errorHandler);

// Start server
app.listen(SERVER_PORT, (): void => {
  console.log(`Server running on port ${SERVER_PORT}`);
});

export default app;
