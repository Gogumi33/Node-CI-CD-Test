const asyncHandler = require("express-async-handler");
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
require('dotenv').config();

const login = asyncHandler(async (req, res) => {
    const { id, password } = req.body;

    try {
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(401).send("유효하지 않은 정보입니다.");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("비밀번호가 일치하지 않습니다.");
        }

        // 위 과정 모두 통과 시, jwt 발행
        const payload = { userID: user.user_key };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '6h' });

        res.cookie('token', token, {
            httpOnly: true,
            // secure: true, // 로컬 테스트 시 주석처리
            // sameSite: 'None' // 로컬 테스트 시 주석처리
        });

        const message = "로그인 성공!";
        res.status(200).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).send("서버 에러");
    }
});

const logout = (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
      });
      res.status(200).send("로그아웃 되었습니다.");
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
};

module.exports = {login, logout};