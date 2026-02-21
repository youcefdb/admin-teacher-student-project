import userDb from "../data/userSet.js";
import USERS_ROLLES from "../config/roles.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const refreshHandle = (req, res) => {
    const cookies = req.cookies; // Got cookies
    if (!cookies?.jwt) return res.sendStatus(204); //check if cookes sended

    const refreshToken = cookies.jwt;

    const findUser = userDb.user.find(us => us.refreshToken === refreshToken);
    if (!findUser) {
        return res.sendStatus(404);
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.sendStatus(403);
            }
            const accessToken = jwt.sign(
                {
                    "userInfo" : {
                    "id": decoded.id,
                    "username": decoded.username,
                    "role": USERS_ROLLES[findUser.role]
                }
                }, 
                process.env.ACCESS_TOKEN_SECRET, 
                {expiresIn: "1d"}
            )
            res.json({accessToken});
        }
    )
}

export default refreshHandle;