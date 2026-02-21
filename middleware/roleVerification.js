const roleCheck = (...allowedRoles) => {
    return (req, res, next) => {
        
        if (!req?.role) {
            return res.sendStatus(401);
        }
        
        const roles = [...allowedRoles];

        const result = roles.includes(req.role);

        if (!result) {
            return res.sendStatus(403);
        }

        next();
    }
}

export default roleCheck;