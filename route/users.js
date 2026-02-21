import express from 'express';
import USERS_ROLLES from "../config/roles.js";
import roleCheck from '../middleware/roleVerification.js';
import {getUsers, addTeacher, updateUser, deleteUser, getUser, approveStudent} from '../controller/users.js';
const userRequest = express.Router();

userRequest
    .get("/", roleCheck(USERS_ROLLES.admin), getUsers) //Get All Users
    .post("/", roleCheck(USERS_ROLLES.admin), addTeacher)
    
userRequest
    .delete("/:id", roleCheck(USERS_ROLLES.admin), deleteUser) //Delete users
    .put("/:id", roleCheck(USERS_ROLLES.admin), updateUser) //Edit user
    .get("/:id", roleCheck(USERS_ROLLES.admin), getUser) //Get user by id
    .patch("/:id", roleCheck(USERS_ROLLES.admin),  approveStudent) //Aprove student by id
    
export default userRequest;