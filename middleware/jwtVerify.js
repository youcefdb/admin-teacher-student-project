import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const verfyJwt = (req, res, next) => {
    const header = req.headers.authorization || req.headers.Authorization; //Check accessing to autho
    if(!header || !header.startsWith("Bearer ")){
        return res.sendStatus(401);
    }
    const token = header.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.sendStatus(403);
            req.id = decoded.userInfo.id;
            req.role = decoded.userInfo.role;
            next();
        }
    )
}

export default verfyJwt;