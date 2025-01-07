import { Router } from "express";
import * as CourseController from "../controller/courseController.js";
import Auth from "../middleware/auth.js";

const courseRouter = Router();


courseRouter.route("/addNewCourse").post( CourseController.addNewCourse);
courseRouter.route("/getAllCourses").get( CourseController.getAllCourses);
courseRouter.route("/getCourseDetailsByID/:id").get( CourseController.getCourseDetailsByID);
courseRouter.route("/updateCourseByID/:id").put( CourseController.updateCourseByID);
courseRouter.route("/deleteCourse/:id").delete(CourseController.deleteCourse);


export default courseRouter;
