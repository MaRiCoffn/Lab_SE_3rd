const DB = require('better-sqlite3');
const dbPath = './data/users.db';

const getRows = (query, params = []) => {
    const DB = require('better-sqlite3');
    const db = new DB('./data/users.db');
    let rows = [];
    try {
        const stmt = db.prepare(query);
        rows = stmt.all(...params);
    } catch (err) {
        console.error(err.message);
    } finally {
        db.close();
    }
    return rows;
};

const selectRecords = () => {
    return getRows('SELECT * FROM users');
};

const selectRecordsOrderBy = (direct) => {
    return getRows(`SELECT * FROM users ORDER BY lastName ${direct}`);
};

module.exports = {
    selectRecords,
    selectRecordsOrderBy,
    getRows
};