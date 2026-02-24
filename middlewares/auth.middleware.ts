import { NextFunction, Response } from "express";
import AccountUser from "../model/account-user.model";
import jwt from "jsonwebtoken";
import { RequestAccount } from "../interface/request.interface";
import AccountCompany from "../model/account-company.model";

export const verifyTokenUser = async (
  req: RequestAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.json({
        code: "error",
        message: "Vui lòng gửi kèm theo token!",
      });
      return;
    }

    var decoded = jwt.verify(
      token,
      `${process.env.JWT_SECRET}`,
    ) as jwt.JwtPayload;
    const { id, email } = decoded;

    const existAccount = await AccountUser.findOne({
      _id: id,
      email: email,
    });

    if (!existAccount) {
      res.clearCookie("token");
      res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
      return;
    }

    req.account = existAccount;

    next();
  } catch (error) {
    console.log(error);
    res.clearCookie("token");
    res.json({
      code: "error",
      message: "Token không hợp lệ!",
    });
    return;
  }
};

export const verifyTokenComany = async (
  req: RequestAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.json({
        code: "error",
        message: "Vui lòng gửi kèm theo token!",
      });
      return;
    }

    var decoded = jwt.verify(
      token,
      `${process.env.JWT_SECRET}`,
    ) as jwt.JwtPayload;
    const { id, email } = decoded;

    const existAccount = await AccountCompany.findOne({
      _id: id,
      email: email,
    });

    if (!existAccount) {
      res.clearCookie("token");
      res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
      return;
    }

    req.account = existAccount;

    next();
  } catch (error) {
    console.log(error);
    res.clearCookie("token");
    res.json({
      code: "error",
      message: "Token không hợp lệ!",
    });
    return;
  }
};
