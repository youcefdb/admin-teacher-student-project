import userDb from "../data/userSet.js"
import {writeFile} from 'fs/promises';
import {fileURLToPath} from "url";
import bcrypt from 'bcrypt';
import path from "path";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);


const getUsers = (req, res) => {
    res.json(userDb.user);
}

const addTeacher = async (req, res) => { //Add Teacher By Admin(role = teacher)
    const {username, password} = req.body;

    if(!username || !password){ //
        return res.status(400).json({"Message": 'Username and Password are Required'}) // 
    }

    const foundUser = userDb.user.find(stud => stud.username === username);

    if(foundUser){
        return res.status(409).json({"Message": `${username} is allready exist`});
    }else{
        try{
            const cryptedPassword = await bcrypt.hash(password, 10); // Crypte The Pass
            const id = userDb.user[userDb.user.length - 1].id + 1 || 1;
            const newTeacher = {
                "id": id,
                "role": "teacher",
                "username": username,
                "password": cryptedPassword
            }
            userDb.setUser([...userDb.user, newTeacher]);
            await writeFile(path.join(__dirname, "..", "data", "userDb.json"), JSON.stringify(userDb.user));
            res.status(200).json(userDb.user);
        }catch(err){
            res.status(500).json(err.Message);
        }
    }
}

const updateUser = async (req, res) => {
    const foundUser = userDb.user.find(stud => stud.id === parseInt(req.params.id));
    if(!foundUser){
        return res.status(404).json({"Message": `${parseInt(req.params.id)} does not exist`});
    }

    if(req.body.username){
        foundUser.username = req.body.username;
    }

    if(req.body.password){
        return res.sendStatus(401);
    }

    await writeFile(path.join(__dirname, "..", "data", "userDb.json"), JSON.stringify(userDb.user));
    res.json(foundUser);
}

const deleteUser = async (req, res) => {
    const foundUser = userDb.user.find(stud => stud.id === parseInt(req.params.id));
    if(!foundUser){
        return res.status(404).json({"Message": `${parseInt(req.params.id)} does not exist`});
    }

    if(req.role === 1000){
        return res.status(400).json({"Message": "You can't delete Admin"});
    }

    const deletedUser = userDb.user.filter(stud => stud.id !== parseInt(req.params.id));
    userDb.setUser(deletedUser.sort((a, b) => a - b));
    await writeFile(path.join(__dirname, "..", "data", "userDb.json"), JSON.stringify(userDb.user));
    res.json({"Message": `${foundUser.role} ${foundUser.username} with ${foundUser.id} deleted succss`});
}

const getUser = (req, res) => {
    const foundUser = userDb.user.find(stud => stud.id === parseInt(req.params.id));
    if(!foundUser){
        return res.status(404).json({"Message": `Student with ${parseInt(req.params.id)} not found`});
    }
    res.json(foundUser);
}

const approveStudent = async (req, res) => {
    const findStudent = userDb.user.find(stud => stud.id === parseInt(req.params.id));
    if(!findStudent || !findStudent.status){
        return res.status(404).json({"Message":"The Student Doesn't Exist!"});
    }

    if(findStudent.status === "approved"){
        return res.status(409).json({"Message":`The student ${findStudent.username} is allready approved`});
    }

    findStudent.status = "approved";
    const exceptApprovedStudent = userDb.user.filter(stud => stud.id !== findStudent.id);
    userDb.setUser([...exceptApprovedStudent, findStudent]);
    await writeFile(path.join(__dirname, "..", "data", "userDb.json"), JSON.stringify(userDb.user));
    res.sendStatus(200);
}

export {getUsers, getUser, addTeacher, updateUser, deleteUser, approveStudent};