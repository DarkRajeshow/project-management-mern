import express from "express";
import {
    getUserData,
    getUserId,
    loginUser,
    logoutUser,
    registerUser
} from "../controllers/auth.js";
import { getAllProjects } from "../controllers/project.js";


const router = express.Router();

// /api/user/
router.get("/", getUserData);
router.get("/id", getUserId);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);



router.get("/projects", getAllProjects);

// router.get("/dashboard", verifyToken, getUserDashboard);
// router.get("/workout", verifyToken, getWorkoutsByDate);
// router.post("/workout", verifyToken, addWorkout);

// router.get("/dashboard2", verifyToken, getUserDashboard2);
// router.get("/diet", verifyToken, getDietsByDate);
// router.post("/diet", verifyToken, addDiet);

export default router;
