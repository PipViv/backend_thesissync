import { Request, Response } from 'express';
import UserDao from '../dao/UserDao';
import Period from '../models/Period';
import { PeriodDAO } from '../dao/PeriodDao';
import { CarrierDAO } from '../dao/CarrierDAO';


export const getAllStudentsList = async (_req: Request, res: Response) => {
  try {
    const userDao: UserDao = new UserDao();
    const listStudents = await userDao.allStudents(); // Esperar la resolución de la promesa
    console.log("-----> ", listStudents);
    return res.status(200).send(listStudents);
  } catch (error) {
    res.status(500).send({ message: "Internal error server" });
  }
}


export const getAllTeachersList = async (_req: Request, res: Response) => {
  try {
    const userDao: UserDao = new UserDao();
    const listTeachers = await userDao.allTeachers(); // Esperar la resolución de la promesa
    return res.status(200).send(listTeachers);
  } catch (error) {
    res.status(500).send({ message: "Internal error server" });
  }
}
export const blockUser = async (req: Request, res: Response) => {
  try {
    const idParam: string | undefined = req.params.id;
    const estadoParam: string | undefined = req.params.estado

    if (idParam === undefined) {
      return res.status(400).json({ error: "El parámetro 'id' es obligatorio" });
    }
    if (estadoParam === undefined) {
      return res.status(400).json({ error: "El parámetro 'id' es obligatorio" });
    }
    const id: number = parseInt(idParam, 10);
    const estado: number = parseInt(estadoParam, 10);
    const userDao: UserDao = new UserDao();
    const listTeachers = await userDao.blockUser(id, estado);
    console.log(listTeachers)
    return res.status(200).send({message: "Exito"});

  } catch (error) {
    res.status(500).send({ message: "Internal error server" });

  }
}

export const createPeriod = async (req: Request, res: Response): Promise<any> => {
  try {
    const periodDAO: PeriodDAO = new PeriodDAO();
    //const periodData: Period = req.body;
    const name = req.body.name;
    const startPeriod = req.body.startPeriod
    const tesisUpEnd = req.body.tesisUpEnd;
    const tesisEvaluationEnd = req.body.tesisEvaluationEnd;
    const endPeriod = req.body.endPeriod;
    const created = new Date(); // Asumiendo que queremos establecer la fecha de creación como la fecha actual
    const newPeriod = new Period(0, name, startPeriod, tesisUpEnd, tesisEvaluationEnd, endPeriod, created);
    await periodDAO.insertPeriod(newPeriod);
    return res.status(201).send('Period created successfully');
  } catch (error) {
    console.error('Error creating period:', error);
    res.status(500).send('Internal server error');
  }
}

export const listPrograms = async(_req: Request, res: Response): Promise<any> =>{
  try {
    const carrier: CarrierDAO = new CarrierDAO();
    const programs = await carrier.getAllCarriersList();
    console.log(programs)
    // const programs = await programRepository.find();

    return res.status(200).json(programs);
  } catch (error) {
    console.error('Error list programs:', error);
    res.status(500).send('Internal server error');
  }
}

export const updatePeriod = async (req: Request, res: Response): Promise<any> => {
  try {
    const periodDAO: PeriodDAO = new PeriodDAO();;
    const periodData: Period = req.body;
    await periodDAO.updatePeriod(periodData);
    return res.status(200).send('Period updated successfully');
  } catch (error) {
    console.error('Error updating period:', error);
    res.status(500).send('Internal server error');
  }
}

export const getAllPeriods = async (_req: Request, res: Response): Promise<any> => {
  try {
    const periodDAO: PeriodDAO = new PeriodDAO();;
    const periods: Period[] = await periodDAO.getAllPeriods();
    return res.status(200).json(periods);
  } catch (error) {
    console.error('Error fetching periods:', error);
    res.status(500).send('Internal server error');
  }
}
export const getActivePeriods = async (_req: Request, res: Response) => {
  try {
    const periodDAO: PeriodDAO = new PeriodDAO();
    const activePeriods = await periodDAO.getActivePeriods();
    console.log(activePeriods)
    return res.json(activePeriods);
  } catch (error) {
    console.error('Error fetching active periods:', error);
    res.status(500).json({ error: 'Error fetching active periods' });
  }
}

export const getAllCarriers = async (_req: Request, res: Response) => {
  try {
    const carriersDAO: CarrierDAO = new CarrierDAO();
    const result = await carriersDAO.getAllCarriersList();
    return res.json(result);
  } catch (error) {
    console.error('Error fetching active periods:', error);
    res.status(500).json({ error: 'Error fetching active periods' });
  }
}
