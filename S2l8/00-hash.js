const crypto = require('crypto');

const getHash = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

const comparePassword = (password, storedHash) => {
    const [salt, oldHash] = storedHash.split(':');
    const newHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return oldHash === newHash;
}

module.exports = { getHash, comparePassword };
