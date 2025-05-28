const sqlite3 = require('sqlite3').verbose();
const { getHash } = require('./00-hash');

const event = (err) => {
    if (err) {
        console.error("Ошибка:", err.message);
    } else {
        console.log("Операция выполнена успешно");
    }
}

const createTable = () => {
    let query = `
        CREATE TABLE IF NOT EXISTS users (
            idUser INTEGER PRIMARY KEY AUTOINCREMENT,
            userName TEXT UNIQUE,
            hashPassword TEXT,
            lastName TEXT
        )
    `;

    db.serialize(() => {
        db.run(query, event);
        //db.close();
    })
}

const dropTable = () => {
    let query = "DROP TABLE IF EXISTS users";
    db.serialize(() => {
        db.run(query, event);
        //db.close();
    })
}

const insertUser = (userName, userPassword, lastName) => {
    const query = `INSERT INTO users (userName, hashPassword, lastName) VALUES (?, ?, ?)`;
    let params = [userName, getHash(userPassword), lastName];
    db.serialize(() => {
        db.run(query, params, event);
        //db.close();
    })
}

const deleteFromTable = (userName) => {
    let query = `DELETE FROM users WHERE userName = ?`;
    db.serialize(() => {
        db.run(query, [userName], event);
        //db.close();
    })
}

const selectAll = () => {
    let query = `SELECT * FROM users`;
    db.serialize(() => {
        db.all(query, (err, rows) => {
            if (err) {
                console.error("Ошибка при выборке:", err.message);
            } else {
                console.log("Пользователи в базе:");
                console.log(JSON.stringify(rows, null, 4));
                console.log(`Всего записей: ${rows.length}`);
            }
        })
        //db.close();
    })
}

const dbPath = './data/db_pass.sqlite3';
const db = new sqlite3.Database(dbPath, event);

// dropTable();
// createTable();
// insertUser('Ivan', 'truePass', 'Иванов');
// insertUser('Petr', 'truePass', 'Петров');
// insertUser('Вика', 'truePass', 'Сидорова');
 selectAll();
