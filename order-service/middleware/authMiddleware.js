import jwt from 'jsonwebtoken';

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader.startsWith('Bearer')){
        return res.status(401).json({msg: 'Mo token provided'});
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        console.log("token--", token);
        if(err){
            return res.status(403).json({ msg: 'Invalid or expired token'});
        }
        req.user = decoded;
        next();
    })
}