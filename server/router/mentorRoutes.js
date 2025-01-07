import { Router } from "express";
import * as MentorController from "../controller/mentorController.js";
import Auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const mentorRouter = Router();


mentorRouter.route("/registerMentor").post(MentorController.registerMentor);
mentorRouter.route("/loginMentor").post(MentorController.loginMentor);
mentorRouter.route("/addMentor").post(upload.single("photo"), MentorController.addMentor);
mentorRouter.route("/getMentors").get(Auth, MentorController.getMentors);
mentorRouter.route("/getMentor/:id").get(MentorController.getMentor);
mentorRouter.route("/deleteMentor/:id").post(Auth, MentorController.deleteMentor);
mentorRouter.route("/deleteMentors").post(Auth, MentorController.deleteMentors);
mentorRouter.route("/blockMentor/:id").post(Auth, MentorController.blockMentor);
mentorRouter.route("/unblockMentor/:id").post(Auth, MentorController.unblockMentor);
mentorRouter.route("/updateAdmin/:id").post(Auth, upload.single("photo"), MentorController.updateMentor);
mentorRouter.route("/updateMentorStatus/:id").post(MentorController.updateMentorStatus);
mentorRouter.route("/pendingMentorsCount").get(MentorController.pendingMentorsCount);

export default mentorRouter;
