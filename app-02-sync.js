const express = require('express');
const { HOST, PORT } = require('./config.json').hosting;

const app = express();

app.set('view engine', 'ejs');
app.use('/css', express.static('css'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./routers/routerPostUser-sync'));
app.use(require('./routers/routerGetUsers-sync'));

app.get('/', (req, res) => {
    res.redirect('/getUsers'); // Перенаправление на страницу с пользователями
});

app.listen(PORT, HOST, () => console.log(`http://${HOST}:${PORT}/`));