import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database.config";
const app = express();
const port = 4000;
import routes from "./routes/index.route";

// Load biến môi trường từ .env
dotenv.config();

// Kết nối DB
connectDB();

// Cấu hình CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Phải chỉ định tên miền cụ thể
    credentials: true, // Cho phép gửi cookie
  }),
);

// Cho phép dữ liệu gửi lên dạng json
app.use(express.json());

// Cấu hình nhận cookie
app.use(cookieParser());

// Thiết lập đường dẫn
app.use("/", routes);

app.listen(port, () => {
  console.log(`Website đang chạy ở cổng ${port}`);
});
