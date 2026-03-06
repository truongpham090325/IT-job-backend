import { Router } from "express";
import * as companyController from "../controllers/company.controller";
import * as companyValidate from "../validates/company.validate";
import * as authMiddleware from "../middlewares/auth.middleware";
import multer from "multer";
import { storage } from "../helpers/clouldinary.helper";

const router = Router();

const upload = multer({ storage: storage });

router.post(
  "/register",
  companyValidate.registerPost,
  companyController.registerPost,
);

router.post("/login", companyValidate.loginPost, companyController.loginPost);

router.patch(
  "/profile",
  authMiddleware.verifyTokenComany,
  upload.single("logo"),
  companyValidate.profilePatch,
  companyController.profilePatch,
);

router.post(
  "/job/create",
  authMiddleware.verifyTokenComany,
  upload.array("images", 8),
  companyValidate.createJobPost,
  companyController.createJobPost,
);

router.get(
  "/job/list",
  authMiddleware.verifyTokenComany,
  companyController.listJob,
);

router.get(
  "/job/edit/:id",
  authMiddleware.verifyTokenComany,
  companyController.editJob,
);

router.patch(
  "/job/edit/:id",
  authMiddleware.verifyTokenComany,
  upload.array("images", 8),
  companyValidate.createJobPost,
  companyController.editJobPatch,
);

router.delete(
  "/job/delete/:id",
  authMiddleware.verifyTokenComany,
  companyController.deleteJobDel,
);

export default router;
