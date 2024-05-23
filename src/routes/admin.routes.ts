import { Router } from "express";
import {blockUser, createPeriod, getActivePeriods, getAllPeriods, getAllStudentsList, getAllTeachersList} from "../controllers/admin.users.controller";

const router = Router();


router.get("/all/students/list", getAllStudentsList)
router.get("/all/teachers/list", getAllTeachersList)
router.post("/periods", createPeriod)
router.get("/periods/active", getActivePeriods)
router.post("/asignar-evaluador", )
router.get("/all/periods", getAllPeriods)
router.get("/user/block/:id/:estado", blockUser)


export default  router ;
