import { Request, Response } from "express";
import AccountUser from "../model/account-user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RequestAccount } from "../interface/request.interface";

export const registerPost = async (req: Request, res: Response) => {
  try {
    const existAccount = await AccountUser.findOne({
      email: req.body.email,
    });

    if (existAccount) {
      res.json({
        code: "error",
        message: "Email đã tồn tại trong hệ thống!",
      });
      return;
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    // Lưu vào CSDL
    const newAccount = new AccountUser(req.body);
    await newAccount.save();

    res.json({
      code: "success",
      message: "Đăng ký tài khoản thành công!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    });
  }
};

export const loginPost = async (req: Request, res: Response) => {
  try {
    const existAccount = await AccountUser.findOne({
      email: req.body.email,
    });

    if (!existAccount) {
      res.json({
        code: "error",
        message: "Tài khoản không tồn tại trong hệ thống!",
      });
      return;
    }

    const isPassword = bcrypt.compareSync(
      req.body.password,
      `${existAccount.password}`,
    );

    if (!isPassword) {
      res.json({
        code: "error",
        message: "Mật khẩu không chính xác!",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: existAccount.id,
        email: existAccount.email,
      },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // https để true, http để false
      sameSite: "lax", // Cho phép gửi cookie giữa các tên miền
    });

    res.json({
      code: "success",
      message: "Đăng nhập thành công!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    });
  }
};

export const profilePatch = async (req: RequestAccount, res: Response) => {
  try {
    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    await AccountUser.updateOne(
      {
        _id: req.account.id,
      },
      req.body,
    );

    res.json({
      code: "success",
      message: "Cập nhập thành công!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    });
  }
};
