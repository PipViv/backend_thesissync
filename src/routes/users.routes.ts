import { Router } from "express";
import {
    refreshToken,
   create,
   signIN,
   userData,
   companionData,
   updateUserInfo,
   getUserInfo
    
} from "../controllers/users.controller";
import authenticate  from "../auth/authenticate";
import { getAllCarriers } from "../controllers/admin.users.controller";

const router = Router();

router.get("/refresh-token", authenticate, refreshToken);
router.post("/create/user", create);
router.post("/auth/signin", signIN);
router.get("/user/data/:id", userData)
router.get("/integrant/:id", companionData)
router.get("/user/info", getUserInfo);

router.post("/update/userInfo", updateUserInfo);
router.get("/carreras", getAllCarriers)


export default  router ;
