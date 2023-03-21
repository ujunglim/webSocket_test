import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname + '/views', 'home.html'));
    // res.send(`Requested at ${req.requestTime}`)
    res.render('home');
})

router.get('/chat', (req, res) => {
    res.render('chat');
})

// 와일드카드 라우터는 항상 다른 라우터 뒤에 적는다 (앞에서 걸리지 않기 위해)
router.get('/room/:id', () => {})

router.get('/*', (req, res) => res.redirect('/')); // 어느 페이지로 접근해도 홈으로 연결

module.exports = router;