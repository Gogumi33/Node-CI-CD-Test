// 서버파일
require("dotenv").config();
const express = require("express");
const path = require("path");
const { sequelize } = require("./config/db");
const cors = require('cors');
// const cookieParser = require('cookie-parser');


// 모델 초기화 및 관계 설정
const User = require('./models/User');
const Post = require('./models/Post');
const Problem = require('./models/Problem');  
const Answer = require('./models/Answer');    

// 모델 초기화 => 초기 한 번만 진행하면 테이블 갱신됨
User.init(sequelize);
Post.init(sequelize);
Problem.init(sequelize);  
Answer.init(sequelize);  

// 모델 간의 관계 설정
User.associate({ Post });
Post.associate({ User, Problem });  
Problem.associate({ Post, Answer }); 
Answer.associate({ Problem });  


const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: true, // 로컬 테스트시 사용
    credentials: true // 쿠키 포함 요청허용
}));
app.use(express.json()); // 🌟🌟🌟 오류났던 이유!!! 이게 cors설정 밑에 바로 와있어야 한다
// app.use(cookieParser());

// DB 연결작업
sequelize.sync({ force: false })
.then(() => { console.log('DB 연결 성공!'); })
.catch(err => { console.log(err); });
// 쿠키파서는 한번 제외해 보자고


// 라우터들 연결작업
app.use("/api", require("./routers/User/loginRoute"));
app.use("/api/register", require("./routers/User/registerRoute"));
app.use("/api/my", require("./routers/User/profileRoute"));
app.use("/api/post", require("./routers/Post/postRoute"));



// 서버 시작 확인 
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});