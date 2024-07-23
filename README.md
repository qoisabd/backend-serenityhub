# Backend for SerenityHub

> Back-End SerenityHub - Skripsi Qois Abdul Qudus

Teknologi yang digunakan :

1. Express
2. Mongoose

## Cara install

1. masukkan file .env di root folder
   1. Tambahkan:
   2. DB_NAME = <nama_database>, misal: DB_NAME: serenityhub
   3. SECRET_KEY= <secret_key>
   4. MA_USER=<mongodb_user>
   5. MA_PASSWORD=<mongodb_password_db>
   6. MA_SERVER= <mongodb_url> 
2. Edit connections.js pada: mongoose.connect(<url_database>, {});   
3. npm install
4. npm run dev
   > server berjalan di port 5500, pastikan port tidak terpakai. Port bisa diganti di index.js

## Fronend SerenityHub
[Frontend SerenityHub](https://github.com/qoisabd/frontend-serenityhub)