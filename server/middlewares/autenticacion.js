const jwt = require('jsonwebtoken');

// ===============
// VERIFICA TOKEN
// ===============
let verificaToken = (req, res, next) => {
    let token = req.get('credencial');

    jwt.verify(token, process.env.SEED, (error, payload) => {
        if (error) {
            res.status(401).json({
                ok: false,
                error: {
                    message: 'Token no válido.'
                }
            });
        };

        req.usuario = payload.usuario;
        next();
    });
};

// ===============
// VERIFICA ADMIN_ROLE
// ===============
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role != 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            error: {
                message: 'El usuario no es administrador.'
            }
        });
    };

    next();
};

module.exports = {
    verificaToken,
    verificaAdmin_Role
};