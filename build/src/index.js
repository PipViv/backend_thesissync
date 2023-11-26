"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/ping', (_req, res) => {
    console.log("Se ha hecho un ping");
    res.send('pong');
});
//Puerto
const port = 4000;
app.listen(port, () => {
    console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
