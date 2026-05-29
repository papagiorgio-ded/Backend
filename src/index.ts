import express, { response } from "express";
import cors from 'cors';
import * as env from './environment/environment';
import * as db from './db-connection';
import multer from 'multer';
//import nodemailer from 'nodemailer';
import fs from 'fs';
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

const nodemailer = require('nodemailer');

const app = express();
app.use(cors({ origin: 'https://quoprint.web.app' }));
app.use(express.json() as any);

const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 3000;

app.get('/getmaterials', async (req, res) => {

  try {

    const query = await db.query(
      `SELECT 
       *
      FROM materiales
      ORDER BY id DESC`
    );

    return res.json(query.rows);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error obteniendo materiales' });
  }

});

app.get('/getpapels', async (req, res) => {

  try {

    const query = await db.query(
      `SELECT 
       *
      FROM papel
      ORDER BY id DESC`
    );

    return res.json(query.rows);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error obteniendo papeles' });
  }

});

app.put('/config-global_laser', async (req, res) => {

  try {
    const {
      mano_obra,
      iva,
      limpieza,
      mascara,
      pintura,
      tiempo_corte
    } = req.body;

    // 🧠 validación básica (evita nulls rotos)
    if (
      mano_obra == null ||
      iva == null ||
      limpieza == null ||
      mascara == null ||
      pintura == null ||
      tiempo_corte == null
    ) {
      return res.status(400).json({
        error: 'Faltan campos en configuración global'
      });
    }

    const result = await db.query(
      `UPDATE config_global_laser SET
        mano_obra = $1,
        iva = $2,
        limpieza = $3,
        mascara = $4,
        pintura = $5,
        tiempo_corte = $6
      WHERE id = 1
      RETURNING *`,
      [
        mano_obra,
        iva,
        limpieza,
        mascara,
        pintura,
        tiempo_corte
      ]
    );

    return res.json({
      message: 'Configuración global actualizada',
      config: result.rows[0]
    });

  } catch (error) {
    console.error('Error config-global:', error);
    return res.status(500).json({
      error: 'Error actualizando configuración global'
    });
  }

});

app.get('/config-global_laser', async (req, res) => {
  const result = await db.query('SELECT * FROM config_global_laser LIMIT 1');
  res.json(result.rows[0]);
});

app.get('/config-global_xerox', async (req, res) => {
  const result = await db.query('SELECT * FROM config_global_xerox LIMIT 1');
  res.json(result.rows[0]);
});

app.post('/materials', async (req, res) => {

  const {
    nombre,
    ancho,
    alto,
    coste,
    merma
  } = req.body;

  try {

    const result = await db.query(
      `INSERT INTO materiales (
        nombre,
        ancho_cm,
        alto_cm,
        coste,
        merma_porcentaje
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        nombre,
        ancho,
        alto,
        coste,
        merma
      ]
    );

    return res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

app.post('/newpapel', async (req, res) => {

  

  const {
    nombre,
    precio_papel
  } = req.body;

  try {

    const result = await db.query(
      `INSERT INTO papel (
        nombre,
        precio_papel
        
      )
      VALUES ($1,$2)
      RETURNING *`,
      [
        nombre,
        precio_papel
      ]
    );

    return res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});



app.put('/materials/:id', async (req, res) => {

  const { id } = req.params;

  const {
    nombre,
    ancho_cm,
    alto_cm,
    coste,
    merma_porcentaje
  } = req.body;

  try {

    const result = await db.query(
      `UPDATE materiales SET
        nombre = $1,
        ancho_cm = $2,
        alto_cm = $3,
        coste = $4,
        merma_porcentaje = $5,
        ultima_modificacion = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *`,
      [
        nombre,
        ancho_cm,
        alto_cm,
        coste,
        merma_porcentaje,
        id
      ]
    );

    return res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

app.put('/config-global-xerox', async (req, res) => {

  const {
    plastificado,
    grapado,
    coste_grapado,
    mano_obra,
    blanco_negro,
    color,
    hendido_maquina,
    hendido_coste
  } = req.body;

  try {

    const result = await db.query(
      `UPDATE config_global_xerox SET
        plastificado = $1,
        grapado = $2,
        coste_grapado = $3,
        mano_obra = $4,
        blanco_negro = $5,
        color = $6,
        hendido_maquina = $7,
        hendido_coste = $8
      WHERE id = 1
      RETURNING *`,
      [
        plastificado,
        grapado,
        coste_grapado,
        mano_obra,
        blanco_negro,
        color,
        hendido_maquina,
        hendido_coste
      ]
    );

    return res.json(result.rows[0]);

  } catch (error) {
    console.error('Error actualizando config xerox:', error);
    return res.status(500).json(error);
  }

});

app.put('/editpapel/:id', async (req, res) => {

  const { id } = req.params;

  const {
   nombre,
   precio_papel
  } = req.body;

  try {

    const result = await db.query(
      `UPDATE papel SET
        nombre = $1,
        precio_papel = $2
      
      WHERE id = $3
      RETURNING *`,
      [
        nombre,
        precio_papel,
        id
      ]
    );

    return res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }

});


app.delete('/deletematerial/:id', async (req, res) => {
  const { id } = req.params;

  try {

    const result = await db.query(
      'DELETE FROM materiales WHERE id = $1 RETURNING *',
      [id]
    );

    return res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }

});
app.delete('/deletepapel/:id', async (req, res) => {
  const { id } = req.params;

  try {

    const result = await db.query(
      'DELETE FROM papel WHERE id = $1 RETURNING *',
      [id]
    );

    return res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }

});


app.post('/users', async (req, res) => {
  const { email, location } = req.body;

  try {
    const check = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (check.rows.length > 0) {
      return res.json({
        message: 'User already exists',
        user: check.rows[0]
      });
    }

    // 👇 aquí asignas rol por defecto
    const rol = 'user';

    const result = await db.query(
      'INSERT INTO users (email, location, rol) VALUES ($1, $2, $3) RETURNING *',
      [email, location, rol]
    );

    res.json({
      message: 'User created',
      user: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});



const transporter = nodemailer.createTransport({
  host: '74.125.140.108',
  port: 465,
  secure: true,

  auth: {
    user: 'noreplypixeltrade@gmail.com',
    pass: process.env.EMAIL_PASS
  },

  tls: {
    servername: 'smtp.gmail.com'
  }
});

/* 📤 RECIBIR PDF */
app.post('/upload-pdf', upload.single('file'), async (req, res) => {

  const email = req.body.email;
  const filePath = req.file?.path;
  console.log(email,filePath)

  if (!filePath) {
    return res.status(400).json({ error: 'No file' });
  }
  if (!req.file) {
  return res.status(400).json({ error: 'No file uploaded' });
}

  try {
    await transporter.sendMail({
      from: 'noreplypixeltrade@gmail.com',
      to: email,
      subject: 'Presupuesto',
      text: 'Adjunto tu presupuesto',
      attachments: [
        {
          filename: 'presupuesto.pdf',
          path: filePath
        }
      ]
    });

    res.json({ ok: true });

  } catch (error: any) {
  console.log("🔥🔥🔥 EMAIL ERROR REAL:", error);
  console.log("STACK:", error?.stack);

  return res.status(500).json({
    message: error?.message,
    fullError: error
  });
}
});



app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});