const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(null, false);
  }
  cb(null, true);
};

const upload = multer({ dest: 'public', fileFilter: imageFilter });

router.post('/uploadimage', upload.single('image'), (req, res) => {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `Kamu belum login atau token kadaluwarsa`,
    });
  }
  const file = req.file;
  console.log(file);

  // console.log(file);
  if (file) {
    const type = req.file.mimetype;
    const fileType = type.substring(type.indexOf('/') + 1);
    console.log(file);
    // const target = path.join(__dirname, '../../public', file.path);
    // console.log(target);

    fs.renameSync(file.path, `${file.path}.${fileType}`);
    res.send({
      status: 'ok',
      message: 'Gambar berhasil diupload',
      image: `${file.filename}.${fileType}`,
    });
  } else {
    res.json({
      error: 1,
      message: 'Upload gambar gagal',
    });
  }
});

router.post('/multiupload', upload.array('image', 3), (req, res) => {
  const image = req.files;
  const imageName = [];
  if (image) {
    for (let i = 0; i < image.length; i++) {
      const target = path.join(
        __dirname,
        '../../public',
        image[i].originalname,
      );
      const fileType = image[i].mimetype.substring(
        image[i].mimetype.indexOf('/') + 1,
      );

      fs.renameSync(image[i].path, `${image[i].path}.${fileType}`);
      imageName.push(`${image[i].filename}.${fileType}`);
    }
    console.log(image);
    return res.json({
      status: 'ok',
      message: 'Gambar berhasil diupload',
      data: imageName,
    });
  } else {
    res.send('Gambar gagal diupload');
  }
});



module.exports = router;
