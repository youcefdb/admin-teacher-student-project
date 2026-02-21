import USERS_ROLES from "../config/roles.js";
import { writeFile } from "fs/promises";
import userDb from "../data/userSet.js";
import {fileURLToPath} from "url";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import path from "path";

dotenv.config();

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);


const loginHandle = async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({"Message": "Username Or Password Are Required"});
    }

    const findUser = userDb.user.find(stud => stud.username === username);
    if (!findUser) {
        return res.sendStatus(401);
    }

    const check = await bcrypt.compare(
        password,
        findUser.password
    )

    if(check){
        const accessToken = jwt.sign(
            {
                "userInfo" : {
                    "id": findUser.id,
                    "username": findUser.username,
                    "role": USERS_ROLES[findUser.role]
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "1d"}
        )

        const refreshToken = jwt.sign(
            {
                "userInfo":{
                    "id": findUser.id,
                    "username": findUser.username,
                    "role": USERS_ROLES[findUser.role]
                }
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: "30d"}
        );        

        const allowedStudent = {...findUser, refreshToken};
        const exceptfindUser = userDb.user.filter(stud => stud.username !== findUser.username);
        userDb.setUser([...exceptfindUser, allowedStudent]);
        await writeFile(path.join(__dirname, "..", "data", "userDb.json"), JSON.stringify(userDb.user));
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 60 * 60 * 1000 * 24});
        res.json({accessToken});
    }else{
        res.sendStatus(401);
    }
}


export default loginHandle;