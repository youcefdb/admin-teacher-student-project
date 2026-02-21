import loginHandle from '../controller/login.js'
import express from 'express';
const loginRoute = express.Router();

loginRoute
    .post("/", loginHandle);

export default loginRoute;