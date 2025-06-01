import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.sendstatus(401);
    }
    const token = authHeader.split(' ')[1];
    try {
        constuser = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.sendStatus(403);
    }
}