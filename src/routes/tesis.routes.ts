import { Router } from "express";
import {
    asignarJurado,
    create,
    downloadDoc,
    evaluarTesis,
    searchDoc,
    showEvaluacionTesis
   // saveThesis,
    //viewTheses,
    //downloadTheses,
    //viewAllThesesAdminDoc,
    //viewAllThesesEs
} from "../controllers/document.controller";

const router = Router();

router.post("/subir/thesis", create)
router.get('/search/documents/:id', searchDoc);
router.get('/descargar/thesis/:id', downloadDoc);
router.post('/asignar-evaluador', asignarJurado);
router.post('/upload/evaluation', evaluarTesis);
router.get("/ver/calificacion/:id", showEvaluacionTesis)

export default  router ;
