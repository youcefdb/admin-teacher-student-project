import userDb from "../data/userSet.js"
import path from "path";
import {fileURLToPath} from "url";
import {writeFile} from 'fs/promises';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

const logoutHandle = async (req, res) => {
    const cookies = req.cookies; //Get cookies
    if (!cookies?.jwt) return res.sendStatus(204); //check if cookes sended

    const refreshToken = cookies.jwt; //get refrech token from cookies

    const foundUser = userDb.user.find( //check if a user match with the token
        stud => stud.refreshToken === refreshToken
    );

    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
    }

    const otherUsers = userDb.user.filter( //Got all user except the found
        stud => stud.refreshToken !== refreshToken
    );

    const outUser = { ...foundUser, refreshToken: '' }; //Create new user with old info and delete token

    userDb.setUser([...otherUsers, outUser]); //Set up new user DB

    await writeFile( //Write the file back
        path.join(__dirname, "..", "data", "userDb.json"),
        JSON.stringify(userDb.user)
    );

    res.clearCookie('jwt', { httpOnly: true }); // clear cookies of founded user
    res.sendStatus(204);
}

export default logoutHandle