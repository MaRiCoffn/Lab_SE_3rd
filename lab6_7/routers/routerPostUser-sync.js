const router = require('express').Router();
const { insertRecord, updateRecord } = require('../models/modelPostUser');
const { getGroups } = require('../models/modelGetGroups');
const modelGetUsers = require('../models/modelGetUsers');

// Для открытия формы добавления
router.get('/postUser', (req, res) => {
    const groups = getGroups();
    res.render('postUser.ejs', {
        groups,
        titleButton: 'Добавить',
        user: {} 
    });
});

// Для открытия формы редактирования
router.get('/postUser/:idUser', (req, res) => {
    const { idUser } = req.params;
    const user = modelGetUsers.getRows(`SELECT * FROM users WHERE idUser = ?`, [idUser])[0] || {};
    const groups = getGroups();
    res.render('postUser.ejs', {
        groups,
        titleButton: 'Изменить',
        user 
    });
});

// Обработка POST-запроса (добавление или редактирование)
router.post('/postUser', (req, res) => {
    const { idUser, lastName, firstName, gender, idGroup } = req.body; 
    if (idUser && idUser !== '') {
        // редактирование
        const params = [lastName, firstName, gender, idGroup, idUser];
        updateRecord(params); 
    } else {
        // добавление
        const params = [lastName, firstName, gender, idGroup];
        insertRecord(params);
    }
    res.redirect('/getUsers');
});

module.exports = router;