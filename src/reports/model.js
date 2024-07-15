const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const reportSchema = Schema(
  {
    title: {
      type: String,
      required: [true, 'judul harus ada'],
      minlength: 5,
      maxlength: 50,
    },
    description: {
      type: String,
      required: [true, 'deskripsi harus ada'],
      minlength: 5,
      maxlength: 250,
    },
    address: {
      type: String,
      required: [true, 'alamat harus ada'],
      minlength: 3,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Menunggu', 'Diproses', 'Selesai', 'Ditolak'],
      default: 'Menunggu',
    },
    imageReport: [String],
    category: {
      type: String,
      required: [true, 'kategori harus ada'],
    },
    reporter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    unitWorks: {
      type: Schema.Types.ObjectId,
      ref: 'UnitWork',
    },
    officerReport: {
      type: Schema.Types.ObjectId,
      ref: 'OfficerReport',
    },
    officer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comment: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true },
);

reportSchema.path('imageReport').validate(
  (value) => {
    if (!value.length) {
      throw 'imageReport is required';
    }
  },
  (attr) => `${attr.value} is required`,
);

module.exports = model('Report', reportSchema);
