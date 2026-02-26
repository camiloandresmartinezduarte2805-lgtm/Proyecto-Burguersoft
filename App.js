const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // <--- DEJA ESTO VACÍO, sin espacios
    database: 'BURGUERSOFT'
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a la base de datos BURGUERSOFT');
});

// REGISTRO
app.post('/registrar', (req, res) => {
    const { nombre, apellido, rol, fecha, genero, correo, password } = req.body;
    const sql = `INSERT INTO Usuario 
    (nombre_usuario, apellido_usuario, rol_usuario, fecha_nacimiento, genero, correo_personal, contraseña) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [nombre, apellido, rol, fecha, genero, correo, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Registro exitoso' });
    });
});

// LOGIN CORREGIDO
app.post('/login', (req, res) => {
    // Usamos nombres simples para recibir los datos
    const correoRecibido = req.body.correo ? req.body.correo.trim() : "";
    const passwordRecibida = req.body.password ? req.body.password.trim() : "";

    console.log(`Intentando entrar con: [${correoRecibido}]`);

    // IMPORTANTE: Revisa si en tu tabla es 'contraseña' o 'contrasena'
    const sql = "SELECT * FROM Usuario WHERE correo_personal = ? AND contraseña = ?";
    
    db.query(sql, [correoRecibido, passwordRecibida], (err, results) => {
        if (err) {
            console.error("Error SQL:", err);
            return res.status(500).json({ success: false, mensaje: "Error de servidor" });
        }

        if (results.length > 0) {
            console.log("¡Usuario encontrado!");
            res.json({ success: true, usuario: results[0] });
        } else {
            console.log("No coincide con la base de datos.");
            res.json({ success: false, mensaje: "Correo o contraseña incorrectos" });
        }
    });
});

// 1. RUTA PARA VERIFICAR SI EL CORREO EXISTE
app.post('/verificar-correo', (req, res) => {
    const { correo } = req.body;
    const sql = "SELECT * FROM Usuario WHERE correo_personal = ?";
    db.query(sql, [correo], (err, results) => {
        if (err) return res.status(500).json({ success: false, mensaje: "Error de servidor" });
        if (results.length > 0) {
            res.json({ success: true, mensaje: "Correo encontrado" });
        } else {
            res.json({ success: false, mensaje: "El correo no está registrado" });
        }
    });
});

// 2. RUTA PARA ACTUALIZAR LA CONTRASEÑA FINAL
app.post('/cambiar-password', (req, res) => {
    const { correo, nuevaPassword } = req.body;
    const sql = "UPDATE Usuario SET contraseña = ? WHERE correo_personal = ?";
    db.query(sql, [nuevaPassword, correo], (err, result) => {
        if (err) return res.status(500).json({ success: false, mensaje: "Error al actualizar" });
        res.json({ success: true, mensaje: "¡Contraseña actualizada con éxito!" });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});