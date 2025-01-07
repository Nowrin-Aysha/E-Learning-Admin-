import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import mentorRoutes from "./mentorRoutes.js";
import courseRoutes from "./courseRoutes.js";
import mediaRoutes from "./mediaRoutes.js";

const router = Router();


router.use("/admin", adminRoutes);  
router.use("/mentor", mentorRoutes); 
router.use("/course", courseRoutes);
router.use("/media", mediaRoutes); 

export default router;
