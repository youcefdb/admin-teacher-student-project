import refreshHandle from '../controller/refreshToken.js';
import express from 'express';

const refreshRoute = express.Router();
refreshRoute
    .get("/", refreshHandle);

export default refreshRoute;