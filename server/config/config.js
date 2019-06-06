// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Fecha de caducidad
// ============================
process.env.CADUCIDAD_TOKEN = '48h';

// ============================
//  SEED de autenticacion
// ============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://bankai:53Fen8db6C60f0Fx@cluster0-1xfud.mongodb.net/cafe';
}
process.env.URLDB = urlDB;

// ============================
//  GOOGLE CLIENT
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '847713734499-pg4rcgf4l32dm8goj73e5c8fjbc1c6u8.apps.googleusercontent.com';