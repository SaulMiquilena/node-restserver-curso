// ===============
// PUERTO
// ===============
process.env.PORT = process.env.PORT || 3000;

// ===============
// ENTORNO
// ===============
process.env.NODE_ENV = process.env.NODE_ENV || 'desarrollo';

// ===============
// BASE DE DATOS
// ===============
let urlDB;

if (process.env.NODE_ENV === 'desarrollo') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:123456a@ds137862.mlab.com:37862/cafe';
}

process.env.URLDB = urlDB;