import { Router } from "express";
import {
    refreshToken,
    createUserStudent,
    loginUser,
    
} from "../controllers/users.controller";
import { authenticate } from "../auth/authenticate";

const router = Router();

router.get("/refresh-token", authenticate, refreshToken);
router.post("/crear/estudiante", createUserStudent)
router.post("/login", loginUser)

export default  router ;
