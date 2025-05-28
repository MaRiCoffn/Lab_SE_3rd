const DB = require('better-sqlite3'); // npm i better-sqlite3
const dbPath = './data/users.db';

const insertRecord = (params) => { // Model from MVC
    const db = new DB(dbPath);
    const query = `INSERT INTO users ("lastName", "firstName", "gender", "idGroup") VALUES (?, ?, ?, ?)`;
    try {
        const stmt = db.prepare(query);
        const result = stmt.run(...params);
        console.log('Inserted ID:', result.lastInsertRowid);
    } catch (err) {
        console.error(err.message);
    } finally {
        db.close();
    }
};

const updateRecord = (params) => { // Model from MVC
    const db = new DB(dbPath);
    const query = `UPDATE users SET lastName = ?, firstName = ?, gender = ?, idGroup = ? WHERE idUser = ?`;
    try {
        const stmt = db.prepare(query);
        const result = stmt.run(...params);
        console.log('Updated rows:', result.changes);
    } catch (err) {
        console.error(err.message);
    } finally {
        db.close();
    }
};

module.exports = {
    insertRecord,
    updateRecord
};