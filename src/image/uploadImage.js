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

router.post('/upload/image', upload.single('image'), (req, res) => {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `You're not not login or token expired`,
    });
  }
  const file = req.file;
  if (file) {
    const type = req.file.mimetype;
    const fileType = type.substring(type.indexOf('/') + 1);
    // console.log(file);
    fs.renameSync(file.path, `${file.path}.${fileType}`);
    res.status(200).json({
      status: 'ok',
      message: 'upload image success',
      image: `${file.filename}.${fileType}`,
    });
  } else {
    res.json({
      error: 1,
      message: 'upload failed, image not found',
    });
  }
});

router.post('/upload/image/multi', upload.array('image', 3), (req, res) => {
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
    // console.log(image);
    return res.json({
      status: 'ok',
      message: 'upload image successfuly',
      data: imageName,
    });
  } else {
    res.send('gagal upload');
  }
});

// delete image

router.delete('/delete/image/:name', (req, res) => {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `You're not not login or token expired`,
    });
  }
  const imageName = req.params.name;
  const filePath = path.join(__dirname, '../../public', imageName);

  // Mengecek apakah file ada
  if (fs.existsSync(filePath)) {
    // Menghapus file
    fs.unlinkSync(filePath);
    res.json({
      status: 'ok',
      message: `image deleted successfully`,
    });
  } else {
    res.status(404).json({
      error: 1,
      message: `image not found`,
    });
  }
});

module.exports = router;
