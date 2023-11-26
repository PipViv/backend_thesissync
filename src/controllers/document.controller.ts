import { Request, Response } from 'express';
import { Theses } from '../models/Theses';
import { ThesesDao } from '../dao/ThesesDao';
import SendWhatsappNotificationService from '../services/SendWhatsappNotificationService';

const tesisDao: ThesesDao = new ThesesDao();

const saveThesis = async (req: Request, res: Response) => {

  const titulo = req.body.titulo;
  const integranteA = req.body.integranteA;
  const integranteB = req.body.integranteB;
  const tutor = req.body.tutor;
  const comentario = req.body.comentario;
  const documento = req.body.documento;
  const fechaSend = req.body.fechaSend;

  const tesis: Theses = new Theses(1, Number(integranteA), Number(integranteB), Number(tutor), documento, fechaSend, comentario, titulo);

  //const tesisDao: ThesesDao = new ThesesDao();

  const sendWhatsappNotificationService: SendWhatsappNotificationService = new SendWhatsappNotificationService();


  sendWhatsappNotificationService.sendWhatsappNotification("Hola El proyecto fue subido correctamente", "+573107806416")
  await tesisDao.insertTheses(tesis);
  res.send("ok");
}

const viewTheses = async (_req: Request, res: Response) => {
  try {
    const sendWhatsappNotificationService: SendWhatsappNotificationService = new SendWhatsappNotificationService();


    sendWhatsappNotificationService.sendWhatsappNotification("Hola tokayo", "+573132441090")
    const theses = await tesisDao.viewAllTheses();
    res.json(theses);
  } catch (error) {
    console.error('Error al obtener tesis:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const downloadTheses = async (req: Request, res: Response) => {
  const thesisId: number = Number(req.params.id);

  try {
    const thesis = await tesisDao.descargarTesisPorId(thesisId);

    if (!thesis) {
      return res.status(404).json({ error: 'Tesis no encontrada' });
    }

    // Aquí asumimos que `thesis.documento` contiene la cadena Base64 del archivo PDF
    const fileContentBase64 = thesis.documento;

    // Usa `thesis.nombre_del_archivo` como el nombre del archivo
    res.json({ fileContentBase64, fileName: `thesis.pdf` });
  } catch (error) {
    console.error('Error al descargar la tesis:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const viewAllThesesAdminDoc = async (req: Request, res: Response) => {
  const user_O: number = Number(req.params.id);
  console.log(user_O)
  try {

    const theses = await tesisDao.viewAllThesesWhereAdmin(user_O);
    res.json(theses);
  } catch (error) {
    console.error('Error al obtener tesis:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
const viewAllThesesEs = async (req: Request, res: Response) => {
  const user_O = req.params.id;
  console.log(user_O)

  try {
    const theses = await tesisDao.viewAllThesesWhereEstu(Number(user_O));
    res.json(theses);
    //console.log(theses)
  } catch (error) {
    console.error('Error al obtener tesis:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export { saveThesis, viewTheses, viewAllThesesAdminDoc, downloadTheses, viewAllThesesEs };
