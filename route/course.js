import express from 'express';
import {addCourse, getCourse, getCourses, addCourseContent, courseUpdate, getMyCourses} from "../controller/course.js";
import USERS_ROLLES from "../config/roles.js";
import roleCheck from '../middleware/roleVerification.js';

const courseRoute = express.Router();

courseRoute
    .post("/", roleCheck(USERS_ROLLES.teacher), addCourse)//Add Course 
    .get("/", roleCheck(USERS_ROLLES.admin, USERS_ROLLES.teacher), getCourses)//Get All Courses
    .get("/my", roleCheck(USERS_ROLLES.teacher, USERS_ROLLES.student), getMyCourses) //Get My Courses
    .get("/:id", roleCheck(USERS_ROLLES.admin, USERS_ROLLES.teacher), getCourse)//Get Course By Id
    .put("/:id", roleCheck(USERS_ROLLES.admin, USERS_ROLLES.teacher), courseUpdate) //Update Course only for owner By Id 
    .post("/:id/content", roleCheck(USERS_ROLLES.teacher), addCourseContent)  // Add content by id to the course

export default courseRoute;