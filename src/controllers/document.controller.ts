import { Request, Response } from 'express';
import { Theses } from '../models/Theses';
import { ThesesDao } from '../dao/ThesesDao';
import moment from 'moment-timezone'; // Importa la biblioteca moment-timezone para manejar la zona horaria
import MessageDoc from '../models/MessageDoc';

export const create = async (req: Request, res: Response) => {
  try {
    const { titulo, autorPublic, integranteA, integranteB, tutor, comentario, documento, extension } = req.body;
    const autorPublicId = autorPublic;

    // Convertir los valores a enteros o null si están vacíos
    const integranteANum = integranteA === '' ? null : parseInt(integranteA);
    const integranteBNum = integranteB === '' ? null : parseInt(integranteB);
    const tutorNum = tutor === '' ? null : parseInt(tutor);

    // Validar que el tutor tenga un ID válido
    if (tutorNum === null) {
      res.status(400).json({ success: false, message: "El tutor es obligatorio" });
      return;
    }

    const fecha_creacionStr: string = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
    const fecha_creacion: Date = new Date(fecha_creacionStr);

    const tesis: Theses = new Theses(autorPublicId, integranteANum, integranteBNum, tutorNum, documento, fecha_creacion, comentario, titulo, extension);
    const tesisDao: ThesesDao = new ThesesDao();

    const isSuccess = await tesisDao.create(tesis);

    if (isSuccess) {
      res.status(200).json({ success: true, message: "Tesis creada exitosamente" });
    } else {
      res.status(500).json({ success: false, message: "Error al crear la tesis" });
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};




export const searchDoc = async (req: Request, res: Response) => {
  try {
    const idParam: string | undefined = req.params.id;
    if (idParam === undefined) {
      return res.status(400).json({ error: "El parámetro 'id' es obligatorio" });
    }
    // Verificar si idParam es un número
    if (!isNaN(Number(idParam))) {
      const id: number = parseInt(idParam, 10);
      const tesisDao: ThesesDao = new ThesesDao();
      const result = await tesisDao.searchDocById(id);

      //console.log(result)
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ error: "El parámetro 'id' debe ser un número" });
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export const downloadDoc = async (req: Request, res: Response) => {
  const thesisId: number = Number(req.params.id);

  try {
    const tesisDao: ThesesDao = new ThesesDao();
    const thesis = await tesisDao.descargarTesisPorId(thesisId);

    if (!thesis) {
      return res.status(404).json({ error: 'Tesis no encontrada' });
    }
    // Aquí asumimos que `thesis.documento` contiene la cadena Base64 del archivo PDF
    const fileContentBase64 = thesis.document;
    // Usa `thesis.nombre_del_archivo` como el nombre del archivo
    res.json({ fileContentBase64, fileName: `${thesis.title}.${thesis.extension}` });
  } catch (error) {
    console.error('Error al descargar la tesis:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


//RETROALIMENTACIONES
export const messagesDoc = async (req: Request, res: Response) => {
  const { authorMessageId, message, doc } = req.body;

  try {
    const chatDoc: MessageDoc = new MessageDoc(0, authorMessageId, message, doc)
    const tesisDao: ThesesDao = new ThesesDao();
    const thesisChat = await tesisDao.saveMessageForDoc(chatDoc);
    console.log(thesisChat)
    res.status(200).json({ message: 'Guardado con exito' });
  } catch (error) {
    console.error('Error al descargar la tesis:', error);
    res.status(500).json({ error: 'Error interno del servidor' });

  }
}

export const showChat = async (req: Request, res: Response) => {
  const thesisId: number = Number(req.params.id);

  try {
    const tesisDao: ThesesDao = new ThesesDao();
    const thesis = await tesisDao.showChatByDocId(thesisId);
    if (thesis.length === 0) {
      res.status(200).json({ message: 'No hay mensajes disponibles para esta tesis' });
    } else {
      res.status(200).json(thesis);
    }
  } catch (error) {
    console.error('Error al buscar los mensajes de la tesis:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export const asignarJurado = async (req: Request, res: Response) => {
  try {
    const {
      juradoId,
      thesisId
    } = req.body;
    const tesisDao: ThesesDao = new ThesesDao();
    await tesisDao.asignarJuradoTesis(juradoId, thesisId);
    return res.status(200).json('Se ha asignado correctamente.');

  } catch (error) {
    console.error('Error al buscar los mensajes de la tesis:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export const evaluarTesis = async (req: Request, res: Response) => {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { thesisId, evaluationFile, evaluationData } = req.body;

    // Hacer lo que necesites con los datos
    console.log('ID de tesis:', thesisId);
    console.log('Archivo de evaluación:', evaluationFile);
    console.log('Datos de evaluación:', evaluationData);

    const investigacion = evaluationData.investigacion;
    const ortografia = evaluationData.ortografia;
    const bibliografia = evaluationData.bibliografia;
    const final = evaluationData.final;
    const tesisDao: ThesesDao = new ThesesDao();
    await tesisDao.evaluartesis(investigacion, ortografia, bibliografia, final, thesisId);
    // Responder con un mensaje de éxito
    return res.status(200).json({ message: 'Datos recibidos correctamente' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
export const showEvaluacionTesis = async (req: Request, res: Response) => {
  try {
    const idParam: string | undefined = req.params.id;
    if (idParam === undefined) {
      return res.status(400).json({ error: "El parámetro 'id' es obligatorio" });
    }
    // Verificar si idParam es un número
    if (!isNaN(Number(idParam))) {
      const id: number = parseInt(idParam, 10);
      const tesisDao: ThesesDao = new ThesesDao();
      const result = await tesisDao.searchEvaluacion(id);
      //console.log(result)
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ error: "El parámetro 'id' debe ser un número" });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}




/*

export const showChat = async(req:Request, res:Response)=>{
  const thesisId: number = Number(req.params.id);

  try{
    console.log(thesisId)
    const tesisDao: ThesesDao = new ThesesDao();
    const thesis = await tesisDao.showChatByDocId(thesisId);
    res.status(200).json(thesis)
  }catch(error){
    console.error('Error al buscar los mensajes de la tesis:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}*/


/*import SendWhatsappNotificationService from '../services/SendWhatsappNotificationService';

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
*/