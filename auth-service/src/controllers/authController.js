import User from "../models/User.js";
import jwt from 'jsonwebtoken';

const createToken = (user) =>{
    return jwt.sign({id: user._id, email:user.email, role: user.role}, process.env.JWT_SECRET, {expiresIn: '15m'});
}

const createRefreshToken = (user) => {
    return jwt.sign({id: user._id},process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'});
}

export const register = async(req, res)=>{
    const { email, password, role} = req.body;
    const existing  = await User.findOne({email: email});
    if(existing){
        return res.status(400).json({msg: 'user already exists'});
    }
    const user = await User.create({email, password, role});
    const accessToken = createToken(user);
    const refreshToken = createRefreshToken(user);
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxage: 7*24*60*60*1000
    });
    return res.status(201).json({accessToken});
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user || !(await user.comparePassword(password))){
        return res.status(401).json({msg: 'Invalid credentials'});
    }

    const accessToken = createToken(user);
    const refreshToken = createRefreshToken(user);

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxage: 7*24*60*60*1000
    });
    console.log('Access granted', accessToken);
     res.status(200).json({accessToken});
}

export const refreshToken = (req, res) => {
    const token = req.cookies.jwt;
    if(!token){
        return res.status(401).json({msg: 'No refresh token'});
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
        if(err) return res.status(403).json({message: `Invalid refrsh token ${err}`});

        const user = await User.findById(decoded.id);
        if(!user) return res.status(404).json({msg: 'user not found'});
        const newAccessToken = createToken(user);
        res.json({ accessToken: newAccessToken });
    })
}

export const logout = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    });
    res.json({ message: "Logged out successfully"});
}