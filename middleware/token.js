const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization'];
    console.log('Token:', token);

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No Token Provided." });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        console.log('Decoded Token:', decoded);
        req.user = { userID: decoded.userID, user_key: decoded.user_key };
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

// 옵셔널 토큰
const optionalVerifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization'];
    console.log('Optional Token:', token);

    if (!token) {
        req.user = null; // 토큰이 없는 경우, req.user를 null로 설정
        return next();
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        console.log('Optional Decoded Token:', decoded);
        req.user = { userID: decoded.userID, email: decoded.email };
        next();
    } catch (error) {
        req.user = null; // 유효하지 않은 토큰인 경우, req.user를 null로 설정
        next();
    }
};

module.exports = { verifyToken, optionalVerifyToken };