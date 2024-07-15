const express = require('express');
const routers = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

routers.get('/', (req, res) => res.send('halaman utama'));
routers.get('/public/download/:name', (req, res) => {
  const filename = `../public/${req.params.name}`;
  if (path.existsSync(filename)) {
    console.log('file ada');
  }
  res.download(path.join(__dirname, filename));
});

routers.get('/public/image/:name', async (req, res, next) => {
  const filename = `../public/${req.params.name}`;
  // console.log(req.params.name);
  const checkImage = fs.existsSync(`public/${req.params.name}`);
  try {
    if (checkImage) {
      res.sendFile(path.join(__dirname, filename));
    } else {
      res.sendFile(path.join(__dirname, '../public/404/404-image.png'));
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = routers;
