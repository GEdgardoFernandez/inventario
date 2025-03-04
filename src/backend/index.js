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
