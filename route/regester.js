import studentRegester from '../controller/regester.js';
import express from 'express';

const regesterRoute = express.Router();
regesterRoute
    .post("/", studentRegester);

export default regesterRoute;