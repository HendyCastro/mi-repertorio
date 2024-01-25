const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = 3001;
const repertorioPath = 'repertorio.json';

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/canciones', async (req, res) => {
  try {
    const { nombre, artista, tono } = req.body;
    const repertorio = JSON.parse(await fs.readFile(repertorioPath, 'utf-8'));
    repertorio.push({ id: repertorio.length + 1, nombre, artista, tono });
    await fs.writeFile(repertorioPath, JSON.stringify(repertorio, null, 2));
    res.status(201).json({ mensaje: 'Canción agregada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar canción' });
  }
});

app.get('/canciones', async (req, res) => {
  try {
    const repertorio = JSON.parse(await fs.readFile(repertorioPath, 'utf-8'));
    res.json(repertorio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener canciones' });
  }
});

app.put('/canciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, artista, tono } = req.body;
    const repertorio = JSON.parse(await fs.readFile(repertorioPath, 'utf-8'));
    const index = repertorio.findIndex((cancion) => cancion.id === parseInt(id));
    if (index !== -1) {
      repertorio[index] = { id: parseInt(id), nombre, artista, tono };
      await fs.writeFile(repertorioPath, JSON.stringify(repertorio, null, 2));
      res.json({ mensaje: 'Canción editada correctamente' });
    } else {
      res.status(404).json({ error: 'Canción no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al editar canción' });
  }
});

app.delete('/canciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let repertorio = JSON.parse(await fs.readFile(repertorioPath, 'utf-8'));
    repertorio = repertorio.filter((cancion) => cancion.id !== parseInt(id));
    await fs.writeFile(repertorioPath, JSON.stringify(repertorio, null, 2));
    res.json({ mensaje: 'Canción eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar canción' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
