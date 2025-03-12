const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require("bcrypt");

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

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM usuarios WHERE nombre = ?", [username], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!user) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        // Verifica la contraseña con bcrypt
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result) {
                return res.json({ message: "Login exitoso", user: { id: user.id, username: user.nombre, rol: user.rol } });
            } else {
                return res.status(401).json({ error: "Contraseña incorrecta" });
            }
        });
    });
});


// Crear usuario con contraseña encriptada
app.post("/usuarios", async (req, res) => {
    try {
        const { username, password, rol } = req.body;

        // Validar que todos los campos están presentes
        if (!username || !password || !rol) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        // Validar que el rol sea correcto
        if (!["admin", "empleado"].includes(rol)) {
            return res.status(400).json({ error: "Rol no válido. Debe ser 'admin' o 'empleado'" });
        }

        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar en la base de datos
        db.run(
            "INSERT INTO usuarios (nombre, password, rol) VALUES (?, ?, ?)", // Ahora tiene 3 "?"
            [username, hashedPassword, rol],
            function (err) {
                if (err) {
                    console.error("Error al insertar usuario:", err);
                    return res.status(500).json({ error: err.message });
                }
                res.json({ id: this.lastID, username, rol });
            }
        );
    } catch (error) {
        console.error("Error en la creación del usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
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