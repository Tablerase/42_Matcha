import { Request, Response } from "express";
import { User } from "@interfaces/userInterface";
import { user as userModel } from "@models/userModel";
import { auth, auth as authModel } from "@models/authModel";
import { createAccessToken, createRefreshToken } from "@utils/jwt";
import { validatePassword } from "@utils/bcrypt";
import { NODE_ENV, JWT_SECRET_KEY } from "@settings";
import jwt from "jsonwebtoken";

const setRefreshTokenCookie = async (user: Partial<User>, req: Request) => {
  const refreshToken = createRefreshToken(user);
  await authModel.createRefreshToken({ id: user.id, token: refreshToken });
  req.res?.cookie("authToken", refreshToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 100,
    expires: new Date(Date.now() + 60 * 60 * 24 * 100),
  });
};

export const authenticateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.body;

    const { username, password } = user;

    const isUserExist = await userModel.getUserByUsername(username);

    if (!isUserExist) {
      res.status(401).json({
        status: 401,
        message: "Invalid User or password",
      });
      return;
    }

    const isPasswordMatched = await validatePassword(
      password,
      isUserExist.password
    );
    if (!isPasswordMatched) {
      res.status(401).json({
        status: 401,
        message: "Invalid User or password",
      });
      return;
    }

    await setRefreshTokenCookie(
      { id: isUserExist.id, email: isUserExist.email },
      req
    );
    res.status(200).json({
      status: 200,
      message: "Login success",
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      res.status(401).json({
        status: 401,
        message: "Unauthorized",
      });
      return;
    }

    res.clearCookie("authToken", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({
      status: 200,
      message: "Logout success",
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
};

export const checkUser = async (req: Request, res: Response): Promise<void> => {
  const authToken = req.cookies?.authToken;

  if (!authToken) {
    res.status(200).json({
      isAuthenticated: false,
      message: "No auth token found",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      authToken,
      JWT_SECRET_KEY as string
    ) as unknown as { id: number };

    if (!decoded.id) {
      res.status(200).json({
        isAuthenticated: false,
        message: "Invalid token payload",
      });
      return;
    }

    req.user = decoded;
    res.status(200).json({
      isAuthenticated: true,
      message: "User is authenticated",
    });
  } catch (err) {
    res.status(200).json({
      isAuthenticated: false,
      message: "Invalid token",
    });
    return;
  }
};
