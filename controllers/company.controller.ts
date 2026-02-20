import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import AccountCompany from "../model/account-company.model";

export const registerPost = async (req: Request, res: Response) => {
  try {
    const existAccount = await AccountCompany.findOne({
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
    const newAccount = new AccountCompany(req.body);
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
