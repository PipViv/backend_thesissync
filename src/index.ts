import express from 'express'
import cors from 'cors';
import bodyParser from 'body-parser';


import userRouter from './routes/users.routes'
import documentRouter from './routes/tesis.routes'
import chat from './routes/chat.routes'
import admin from './routes/admin.routes'


const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: 'http://localhost:5173' // Permitir solicitudes solo desde localhost:5173
}));
app.use(express.json())


app.use('/api/users', userRouter);
app.use('/api/document', documentRouter)
app.use('/api/chat', chat)
app.use('/api/admin', admin)



//Puerto
const port = 4001;
app.listen(port, () => {
    console.log(`Servidor en funcionamiento en el puerto ${port}`);
})