import { v2 as cloudinary } from "cloudinary";
import CloudinaryStorage from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: "dwfupuebl",
  api_key: "991327967523154",
  api_secret: "RjoavfClqIZJt5QRNAEes35bqMM",
});

export const storage = CloudinaryStorage({
  cloudinary: cloudinary,
});
