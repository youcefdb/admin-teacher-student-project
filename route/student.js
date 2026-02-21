import express from 'express';
import {getCourses, enrollOnCourse, getMyCourses} from '../controller/student.js';
import USERS_ROLLES from "../config/roles.js";
import roleCheck from '../middleware/roleVerification.js';
 
const studentRoute = express.Router();

studentRoute
    .get("/",  roleCheck(USERS_ROLLES.admin, USERS_ROLLES.teacher, USERS_ROLLES.student), getCourses) //Get courses dispo
    .post("/:id/enroll", roleCheck(USERS_ROLLES.student), enrollOnCourse) //Enroll to a course
    .get("/my-courses", roleCheck(USERS_ROLLES.student), getMyCourses) //Get enrolled courses

export default studentRoute;