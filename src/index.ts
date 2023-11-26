import express from 'express'
import cors from 'cors';
import bodyParser from 'body-parser';


import userRouter from './routes/users.routes'
import documentRouter from './routes/tesis.routes'


const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.json())


app.use('/api/users', userRouter);
app.use('/api/document', documentRouter)

//Puerto
const port = 4001;
app.listen(port, () => {
    console.log(`Servidor en funcionamiento en el puerto ${port}`);
})