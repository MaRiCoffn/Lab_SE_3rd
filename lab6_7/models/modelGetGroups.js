const DB = require('better-sqlite3');
const dbPath = './data/users.db'; 

const getGroups = () => {
    const db = new DB(dbPath);
    const query = `SELECT * FROM groups`; 
    let rows = [];
    
    try {
        const stmt = db.prepare(query);
        rows = stmt.all();
    } catch (error) {
        console.log(error.message);
    } finally {
        db.close();
    }

    return rows;
}

module.exports = {
    getGroups,
};