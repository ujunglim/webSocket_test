import express from 'express';
import path from 'path';
import router from './router'
const app = express();

app.set('view engine', 'pug'); // 사용할 템플릿 엔진설정
app.set('views', __dirname + '/views'); // 템플릿이 있는 폴더위치

// ============= MIDDLEWARE ============
// custom middleware
const addRequestTime = (req, res, next) => {
    const date = new Date();
    req.requestTime = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
    next();
}
app.use(addRequestTime);
app.use(express.static(path.join(__dirname, 'views'))); // 유저가 볼 수 있는 정적파일 경로설정 (보안상 유저는 서버에서 우리가 보여주는 것만 볼 수 있다.)
app.use('/', router);

// ============= ERROR HANDLING ============
app.use((req, res, next) => res.status(404).send('일치하는 주소가 없습니다'));
// next(err)가 호출되는 순간 다른 app.use는 모두 건너뛰고 바로 err 매개변수가 있는 app.use로 넘어온다
// (이게 없음 next로 에러를 넘겨주었을때 처리할 부분이 없어 서버가 죽는다.)
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('서버 에러')
})

app.listen(3000, () => console.log('Listening 3000~~'));