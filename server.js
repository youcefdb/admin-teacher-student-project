import express from 'express';
import userRequest from './route/users.js';
import verfyJwt from './middleware/jwtVerify.js';
import courseRoute from './route/course.js';
import cookieParser from 'cookie-parser';
import loginRoute from './route/login.js'
import regesterRoute from './route/regester.js';
import studentRoute from './route/student.js';
import logoutRote from './route/logout.js';
import refreshRoute from './route/refresh.js';
import checkCors from "./config/cors.js";
import cors from 'cors';
import dotenv from "dotenv";
import logEvent from './middleware/logEvent.js';

dotenv.config();

const app = express();
const port = process.env.port ?? 3500;

app.use((req, res, next) => {
    logEvent(`${req.url}\t${req.method}${req.headers.origin}`);
    next();
})

app.use(cors(checkCors));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

app.use("/regester", regesterRoute);
app.use("/login", loginRoute);
app.use("/refresh", refreshRoute);
app.use("/logout", logoutRote);

app.use(verfyJwt);
app.use("/users", userRequest);
app.use("/courses", courseRoute);
app.use("/student", studentRoute);

app.listen(port, () => {
    console.log(`Listenning From ${port}`);
});