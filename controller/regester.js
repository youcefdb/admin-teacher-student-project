import userDb from "../data/userSet.js";
import bcrypt from "bcrypt";
import {writeFile} from 'fs/promises';
import {fileURLToPath} from "url";
import path from "path";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

const studentRegester = async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({"Message": 'Username and Password are Required'});
    }

    const findStudent = userDb.user.find(stud => stud.username === username);

    if (findStudent) {
        return res.status(409).json({ "Message": "Registration failed" });
    }

    try{
        const id = userDb.user.length === 0 ? 1 : userDb.user[userDb.user.length - 1].id + 1;
    
        const cpw = await bcrypt.hash(password, 10);
        
        const newStudent = {
            "id": id,
            "username": username,
            "role": "student",
            "status": "pending",
            "password": cpw,
        }

        userDb.setUser([...userDb.user, newStudent]);
        await writeFile(path.join(__dirname, "..", "data", "userDb.json"), JSON.stringify(userDb.user));
        res.status(200).json(userDb.user);
    }catch(err){
        res.status(500).json(err.message);
    }
}

export default studentRegester;