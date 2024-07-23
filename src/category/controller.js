const Category = require('./model');

async function addCategory(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `Kamu belum login atau token kadaluwarsa`,
    });
  }
  try {
    const payload = req.body;
    const userRole = req.user.role;
    if (userRole === 'user') {
      res.json({
        error: 1,
        message: 'Kamu tidak memiliki akses',
      });
    } else {
      const newCategory = new Category({ ...payload });
      await newCategory.save();
      if (newCategory) {
        return res.json({
          status: 'ok',
          message: 'Tambah kategori berhasil',
          categoryId: newCategory._id,
        });
      }
    }
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
}

async function getCategory(req, res, next) {
  try {
    const category = await Category.find().select('-_id -__v');
    if (category) {
      return res.json({
        status: 'ok',
        data: category,
      });
    }
  } catch (err) {
    return res.json({
      error: 1,
      message: err.message,
    });
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  const userRole = req.user.role;

  if (!req.user && userRole === 'user') {
    return res.json({
      error: 1,
      message: `Kamu belum login atau token kadaluwarsa`,
    });
  }
  try {
    const categoryId = req.params.id;
    const category = await Category.findOneAndDelete({
      category_id: categoryId,
    });
    if (category) {
      return res.json({
        status: 'ok',
        message: 'Hapus kategori berhasil',
      });
    } else {
      return res.json({
        error: 1,
        message: 'Kategori tidak ditemukan',
      });
    }
  } catch (err) {
    return res.json({
      error: 1,
      message: err.message,
    });
    next(err);
  }
}

module.exports = { addCategory, getCategory, deleteCategory };
