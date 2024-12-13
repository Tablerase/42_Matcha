import { Request, Response } from "express";
import { User } from "@interfaces/userInterface";
import { user as userModel } from "@models/userModel";
import { createAccessToken, createRefreshToken } from "@utils/jwt";
import { validatePassword } from "@utils/bcrypt";

const setRefreshTokenCookie = async (user: Partial<User>, req: Request) => {
  const refreshToken = await createRefreshToken(user);
  req.res?.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    path: "/auth/refresh_token",
    sameSite: false,
    maxAge: 60 * 60 * 24 * 100,
    expires: new Date(Date.now() + 60 * 60 * 24 * 100),
  });
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Trying to register" + req);
  try {
    const userData: Partial<User> = req.body;
    // TODO verify userData with middleware
    if (
      !userData.email ||
      !userData.username ||
      !userData.password ||
      !userData.firstName ||
      !userData.lastName
    ) {
      res.status(400).json({
        status: 400,
        message: "All fields are required",
      });
      return;
    }
    console.log(userData);
    const existingUserEmail = await userModel.getUserByEmail(userData.email);
    const existingUserName = await userModel.getUserByUsername(userData.username);
    if (existingUserName) {
      res.status(400).json({
        status: 400,
        message: "Username already in use",
      });
      return;
    } else if (existingUserEmail) {
      res.status(400).json({
        status: 400,
        message: "Email already in use",
      });
      return;
    }

    const newUser = await userModel.createUser(userData);

    res.status(201).json({
      status: 201,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: (error as Error).message,
    });
  }
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
      res.status(404).json({
        status: 404,
        message: "User not found",
      });
      return;
    }

    const isPasswordMatched = await validatePassword(password, isUserExist.password);
    console.log(isPasswordMatched);
    if (!isPasswordMatched) {
      res.status(400).json({
        status: 400,
        success: false,
        message: "Wrong password",
      });
      return;
    }

    const token = createAccessToken({
      id: isUserExist.id,
      email: isUserExist.email,
    });
    await setRefreshTokenCookie({ id: isUserExist.id, email: isUserExist.email }, req);
    res.status(200).json({
      status: 200,
      success: true,
      message: "login success",
      token: token,
    });
    
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
};
