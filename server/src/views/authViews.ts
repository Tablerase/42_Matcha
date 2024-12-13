import { Request, Response } from "express";
import { User } from "@interfaces/userInterface";
import { user as userModel } from "@models/userModel";
import { createAccessToken } from "@utils/jwt";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData: Partial<User> = req.body;
    const existingUser = await userModel.getUserByEmail(userData.email);
    if (existingUser) {
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

export const authenticateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.body;

    const { email, password } = user;

    const isUserExist = await userModel.getUserByEmail(email);

    if (!isUserExist) {
      res.status(404).json({
        status: 404,
        message: "User not found",
      });
return;
    }

    // TODO HASH THE PASSWORD
    const isPasswordMatched =
      isUserExist?.password === password;

    if (!isPasswordMatched) {
      res.status(400).json({
        status: 400,
        success: false,
        message: "wrong password",
      });
        return;
    }
    
    const token = createAccessToken({id: isUserExist.id, email: isUserExist.email});

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
