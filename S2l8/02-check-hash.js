const DB = require('better-sqlite3');
const { comparePassword } = require('./00-hash');

const dbPath = './data/db_pass.sqlite3';
const db = new DB(dbPath);

const checkPassword = (userName, password) => {
    let query = `SELECT * FROM users WHERE userName = ?`;
    let stmt = db.prepare(query);
    let record = stmt.get(userName);

    if (!record) {
        console.log(`Пользователь с логином "${userName}" не найден.`);
        return false;
    }

    const isValid = comparePassword(password, record.hashPassword);
    if (isValid) {
        console.log(`Пользователь "${userName}" успешно аутентифицирован. Фамилия: ${record.lastName}`);
    } else {
        console.log(`Неверный пароль для пользователя "${userName}".`);
    }
    return isValid;
}

let userName = 'Petr';
let pass = 'truePass';
// let pass = 'falsePass';

let res = checkPassword(userName, pass);
console.log(`Результат проверки пароля для ${userName}:`, res);

/*const allUsers = db.prepare('SELECT userName, lastName FROM users').all();
console.log(allUsers);*/
