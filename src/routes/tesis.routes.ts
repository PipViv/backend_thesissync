import { Router } from "express";
import {
    saveThesis,
    viewTheses,
    downloadTheses,
    viewAllThesesAdminDoc,
    viewAllThesesEs
} from "../controllers/document.controller";

const router = Router();

router.post("/subir/thesis", saveThesis)
router.get('/obtener/theses', viewTheses);
router.get('/descargar/thesis/:id', downloadTheses);
router.get('/doc/obtener/theses/id=:id', viewAllThesesAdminDoc);
router.get('/est/obtener/theses/id=:id', viewAllThesesEs);

export default  router ;
