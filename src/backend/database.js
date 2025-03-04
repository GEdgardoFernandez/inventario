const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./inventario.db', (err) => {
    if (err) {
        console.error("Error al conectar con la base de datos", err.message);
    } else {
        console.log("Conectado a la base de datos SQLite");
    }
});

// Crear tabla si no existe
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        stock INTEGER NOT NULL
    )`);
});

module.exports = db;
