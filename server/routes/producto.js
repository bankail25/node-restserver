const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

//============================================
// OBTENER PRODUCTOS
//============================================
app.get('/producto', verificaToken, (req, res) => {
    //TRAE TODOS LOS PRODUCTOS
    //POPULATE: USUARIO CATEGORIA
    //PAGINADO

    Producto.find({ disponible: true })
    .sort('nombre')
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre email')
    .exec (( err, productos ) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            productos
        });  
    });

});

//============================================
// OBTENER UN PRODUCTO POR ID
//============================================
app.get('/producto/:id', (req, res) => {
    //POPULATE: USUARIO CATEGORIA

    let id = req.params.id;

    Producto.findById(id, ({estado:true}, 'nombre disponible precioUni'), (err, productoDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(500).json({
               ok: false,
               err:{
                   message: 'El ID no es correcto'
               }
           });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//============================================
// BUSCAR PRODUCTOS
//============================================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    
    let termino = req.params.termino;
    
    //EXPRESION REGULAR

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
    .populate('categoria', 'nombre')
    .exec((err, productos) => {
        if(err){
            return res.status(500).json ({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            productos
        });
        });
});

//============================================
// CREAR UN NUEVO PRODUCTO
//============================================
app.post('/producto', verificaToken,  (req, res) => {
    //GRABAR UN USUARIO
    //GRABAR UN PRODUCTO DEL LISTADO DE CATEGORIA

    let body = req.body;

    let producto = new Producto ({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria:  body.categoria,
        usuario: req.usuario._id
    });

    producto.save(( err, productoDB ) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json ({
            ok: true,
            producto: productoDB
        });
    });
});

//============================================
// ACTUALIZAR PRODUCTO
//============================================
app.put('/producto/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
    let body = req.body;

    let descProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    };

    Producto.findByIdAndUpdate(id, descProducto, {new: true, runValidators: true}, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB) {
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'No se actualizo el parametro'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//============================================
// BORRAR UN PRODUCTO
//============================================
app.delete('/producto/:id', verificaToken, (req, res) => {
    //PASAR DE TRUE A FALSE
    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: usuarioBorrado,
            message: 'Producto Borrado'
        });
    });

});

module.exports = app;