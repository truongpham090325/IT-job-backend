import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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
    origin: "*", // cho phép tất cả tên miền truy cập
  }),
);

// Cho phép dữ liệu gửi lên dạng json
app.use(express.json());

// Thiết lập đường dẫn
app.use("/", routes);

app.listen(port, () => {
  console.log(`Website đang chạy ở cổng ${port}`);
});
