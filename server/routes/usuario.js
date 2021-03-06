const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const app = express();

const Usuario = require('../models/usuario');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const middlewares = [verificaToken, verificaAdmin_Role];

app.get('/usuario', verificaToken, (req, res) => {

    /*return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    });*/

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let condiciones = {
        estado: true
    }

    Usuario.find(condiciones, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((error, usuarioDB) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            };

            Usuario.countDocuments(condiciones, (error, total) => {
                res.status(200).json({
                    ok: true,
                    usuarios: usuarioDB,
                    total
                });
            });
        });
});

app.post('/usuario', middlewares, (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((error, usuarioDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        };

        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', middlewares, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, usuarioDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        };

        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', middlewares, (req, res) => {
    let id = req.params.id;

    let cambiarEstado = {
        estado: false
    };

    //Usuario.findByIdAndRemove(id, (error, usuarioDB) => {
    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (error, usuarioDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        };

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'Usuario no existe'
                }

            });
        };

        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

module.exports = app;