import { Router } from "express";
import * as AdminController from "../controller/adminController.js";
import Auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const adminRouter = Router();


adminRouter.route("/register").post(AdminController.register);
adminRouter.route("/login").post(AdminController.login);
adminRouter.route("/deleteAdmins").post(Auth, AdminController.deleteAdmins);
adminRouter.route("/blockAdmin/:id").post(Auth, AdminController.blockAdmin);
adminRouter.route("/unblockAdmin/:id").post(Auth, AdminController.unblockAdmin);
adminRouter.route("/addAdmin").post(upload.single("photo"), AdminController.addAdmin);
adminRouter.route("/getAdmins").get(Auth, AdminController.getAdmins);
adminRouter.route("/deleteAdmin/:id").post(Auth, AdminController.deleteAdmin);
adminRouter.route("/updateAdmin/:id").post(Auth, upload.single("photo"), AdminController.updateAdmin);

export default adminRouter;
