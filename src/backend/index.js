const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware para leer JSON

// Obtener todos los productos
app.get('/productos', (req, res) => {
    db.all("SELECT * FROM productos", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Agregar un nuevo producto
app.post('/productos', (req, res) => {
    const { nombre, stock } = req.body;
    db.run("INSERT INTO productos (nombre, stock) VALUES (?, ?)", [nombre, stock], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nombre, stock });
    });
});

// Actualizar un producto
app.put('/productos/:id', (req, res) => {
    const { nombre, stock } = req.body;
    db.run("UPDATE productos SET nombre = ?, stock = ? WHERE id = ?", [nombre, stock, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Producto actualizado", changes: this.changes });
    });
});

// Eliminar un producto
app.delete('/productos/:id', (req, res) => {
    db.run("DELETE FROM productos WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Producto eliminado", changes: this.changes });
    });
});

// Iniciar el servidor
const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

// Login de prueba
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'guille' && password === 'admin') {
        res.json({ message: 'Inicio de sesión exitoso' });
    } else {
        res.status(401).json({ error: 'Credenciales incorrectas' });
    }
});

//crear usuario
app.post('/usuarios', (req, res) => {
    const { username, password, rol } = req.body;
    db.run("INSERT INTO usuarios (nombre, password, rol) VALUES (?, ?)", [username, password, rol], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, username, password, rol });
    });
});

//Proveedores
app.get('/proveedores', (req, res) => {
    db.all("SELECT * FROM proveedores", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/proveedores', (req, res) => {
    const { nombre, direccion, telefono } = req.body;
    db.run("INSERT INTO proveedores (nombre, direccion, telefono) VALUES (?, ?, ?)", [nombre, direccion, telefono], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nombre, direccion, telefono });
    });
});

app.put('/proveedores/:id', (req, res) => {
    const { nombre, direccion, telefono } = req.body;
    db.run("UPDATE proveedores SET nombre = ?, direccion = ?, telefono = ? WHERE id = ?", [nombre, direccion, telefono, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Proveedor actualizado", changes: this.changes });
    });
});

app.delete('/proveedores/:id', (req, res) => {
    db.run("DELETE FROM proveedores WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Proveedor eliminado", changes: this.changes });
    });
});