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
  const checkImage = fs.existsSync(`public/${req.params.name}`);
  console.log(checkImage);
  try {
    if (checkImage) {
      res.sendFile(path.join(__dirname, filename));
      console.log('ada');
    }
    res.sendFile(path.join(__dirname, '../public/404/404image.png'));
  } catch (error) {
    res.sendFile(path.join(__dirname, '../public/404/404image.png'));
  }
  // res.sendFile(path.join(__dirname, '../public/404/404image.png'));
});

module.exports = routers;
