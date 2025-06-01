
export const verifyRole = (requiredRole)=>{
    return (req, res, next) =>{
        if(!req.user || req.user.role != requiredRole){
            return res.status(403).json({ msg: 'Access denied due to insufficient role'});
        }
        next();
    }
}