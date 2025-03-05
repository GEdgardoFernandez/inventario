const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./inventario.db', (err) => {
    if (err) {
        console.error("Error al conectar con la base de datos:", err.message);
    } else {
        console.log("Conectado a la base de datos SQLite");
    }
});

// Crear tablas si no existen
db.serialize(() => {
    // Tabla productos
    db.run(`CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        stock INTEGER NOT NULL,
        precio REAL NOT NULL,
        descripcion TEXT NOT NULL,
        categoria TEXT NOT NULL,
        imagen BLOB NOT NULL,
        fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        estado TEXT NOT NULL,
        proveedor_id INTEGER NOT NULL,
        ubicacion TEXT NOT NULL,
        codigo_barras TEXT NOT NULL,
        peso REAL NOT NULL,
        volumen REAL NOT NULL,
        dimensiones TEXT NOT NULL,
        color TEXT NOT NULL,
        marca TEXT NOT NULL,
        modelo TEXT NOT NULL,
        garantia TEXT NOT NULL,
        FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE
    )`);

    // Tabla usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        password TEXT NOT NULL,
        rol TEXT NOT NULL CHECK (rol IN ('admin', 'empleado')),
        fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla proveedores
    db.run(`CREATE TABLE IF NOT EXISTS proveedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        contacto TEXT NOT NULL,
        telefono TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        direccion TEXT NOT NULL,
        empresa TEXT NOT NULL,
        fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;
