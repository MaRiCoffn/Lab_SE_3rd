const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const DB = require('better-sqlite3');
const { comparePassword } = require('./00-hash');

const app = express();
const dbPath = './data/db_pass.sqlite3';
const db = new DB(dbPath);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Статические файлы (css)
app.set('view engine', 'ejs');
app.use('/css', express.static('css'));

// Middleware для проверки аутентификации
const checkAuth = (req, res, next) => {
    const userName = req.cookies.userName;
    if (!userName) {
        return res.redirect('/login');
    }
    // Проверим, что такой пользователь есть в базе
    const user = db.prepare('SELECT * FROM users WHERE userName = ?').get(userName);
    if (!user) {
        // Если пользователь не найден, очистим куку и редирект
        res.clearCookie('userName');
        return res.redirect('/login');
    }
    // Добавим данные пользователя в req для дальнейшего использования
    req.user = user;
    next();
}

// GET /login - показать форму входа
app.get('/login', (req, res) => {
    const error = req.query.error;
    res.render('login', { error });
});

// POST /login - обработка формы входа
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.redirect('/login?error=1');
    }

    // Получаем пользователя из БД
    const user = db.prepare('SELECT * FROM users WHERE userName = ?').get(username);

    if (!user) {
        // Пользователь не найден
        return res.redirect('/login?error=1');
    }

    // Проверяем пароль
    if (!comparePassword(password, user.hashPassword)) {
        // Неверный пароль
        return res.redirect('/login?error=1');
    }

    // Аутентификация успешна - устанавливаем куку с userName (можно токен, но для простоты - userName)
    res.cookie('userName', user.userName, {
        httpOnly: true,
        maxAge: 2 * 60 * 60 * 1000, // 2 часа
        // secure: true, // если HTTPS
        // sameSite: 'lax',
    });

    res.redirect('/dashboard');
});

// GET /dashboard - личный кабинет (защищённый)
app.get('/dashboard', checkAuth, (req, res) => {
    // req.user содержит данные пользователя из middleware
    res.render('dashboard', { lastName: req.user.lastName, userName: req.user.userName });
});

// GET /logout - выход
app.get('/logout', (req, res) => {
    res.clearCookie('userName');
    res.redirect('/login');
});

// Настройка движка шаблонов EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Маршрут для /
app.get('/', (req, res) => {
    const login = req.cookies.login;
    if (login) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Запуск сервера
app.listen(3000, () => {
    console.log('http://localhost:3000');
});
