import logoutHandle from '../controller/logout.js';
import express from 'express';
const logoutRote = express.Router();

logoutRote
    .get("/", logoutHandle);

export default logoutRote;