const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const app = express();

const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (error, usuarioDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        };

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Usuario o contraseña incorrectos."
                }
            });
        };

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Usuario o contraseña incorrectos."
                }
            });
        };

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {
            expiresIn: process.env.CADUCIDAD_TOKEN //Expira en 30 días 
        });

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

module.exports = app;