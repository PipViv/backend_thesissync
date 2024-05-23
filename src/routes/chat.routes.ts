import { Router } from "express";
import {messagesDoc,showChat} from "../controllers/document.controller";

const router = Router();

router.post("/send/message", messagesDoc)
router.get('/show/messages/:id', showChat);

export default router ;
