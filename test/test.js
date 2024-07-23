const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();
const User = require('../src/user/model');
const db = require('../connection');
const Report = require('../src/reports/model');

chai.use(chaiHttp);

let token;
let idReport = '';

describe('API Endpoints', function () {
  this.timeout(50000);

  // Tes endpoint /register
  describe('/POST register', () => {
    it('it should register a user', (done) => {
      let user = {
        name: 'Test User',
        email: 'testuser@gmail.com',
        password: 'password',
      };
      chai
        .request(server)
        .post('/register')
        .send(user)
        .end((err, res) => {
          let errors = [];
          if (res.body.error) {
            errors.push(`Terjadi kesalahan: ${res.body.message}`);
          } else {
            if (res.body.status === undefined) {
              errors.push('Properti status tidak ada dalam respons');
            } else if (res.body.status !== 'ok') {
              errors.push(`Properti status dalam respons bukan "ok", tetapi "${res.body.status}"`);
            }
            if (res.body.message === undefined) {
              errors.push('Properti message tidak ada dalam respons');
            } else if (res.body.message !== 'register successfuly') {
              errors.push(`Properti message dalam respons bukan "register successfuly", tetapi "${res.body.message}"`);
            }
          }
          if (errors.length > 0) {
            console.log(errors.join('\n'));
            throw new Error(errors.join('\n'));
          } else {
            console.log('- test register berhasil');
          }
          done();
        });
    });
  });

  describe('API Endpoints', () => {
    // Test /login endpoint
    describe('/POST login', () => {
      it('it should login a user', (done) => {
        let user = {
          email: 'testuser@gmail.com',
          password: 'password',
        };
        chai
          .request(server)
          .post('/login')
          .send(user)
          .end((err, res) => {
            let errors = [];
            if (res.body.error) {
              errors.push(`Terjadi kesalahan: ${res.body.message}`);
            } else {
              if (res.body.message === undefined) {
                errors.push('Properti message tidak ada dalam respons');
              } else if (res.body.message !== 'logged in successfully') {
                errors.push(`Properti message dalam respons bukan "logged in successfully", tetapi "${res.body.message}"`);
              }
              if (res.body.token === undefined) {
                errors.push('Properti token tidak ada dalam respons');
              }
              if (res.body.user === undefined) {
                errors.push('Properti user tidak ada dalam respons');
              } else {
                if (res.body.user.name === undefined) {
                  errors.push('Properti name tidak ada dalam user');
                }
                if (res.body.user.email === undefined) {
                  errors.push('Properti email tidak ada dalam user');
                }
                if (res.body.user.role === undefined) {
                  errors.push('Properti role tidak ada dalam user');
                }
                // if (res.body.user.customer_id === undefined) {
                //   errors.push('Properti customer_id tidak ada dalam user');
                // }
              }
            }
            if (errors.length > 0) {
              console.log(errors.join('\n'));
              throw new Error(errors.join('\n'));
            } else {
              console.log('- test Login berhasil');
            }
            token = res.body.token;
            done();
          });
      });
    });
  });

  // Test /report endpoint
  describe('/POST report', () => {
    it('it should create a report', (done) => {
      let report = {
        title: 'Test Report',
        description: 'This is a test report',
        address: 'Test Address',
        category: 'Jalan',
        longitude: '123.456',
        latitude: '78.90',
        imageReport: ['image1.png', 'image2.png'],
      };
      chai
        .request(server)
        .post('/report')
        .set('Authorization', 'Bearer ' + token)
        .send(report)
        .end((err, res) => {
          let errors = [];
          if (res.body.error) {
            errors.push(`Terjadi kesalahan: ${res.body.message}`);
          } else {
            if (res.body.status === undefined) {
              errors.push('Properti status tidak ada dalam respons');
            } else if (res.body.status !== 'ok') {
              errors.push(`Properti status dalam respons bukan "ok", tetapi "${res.body.status}"`);
            }
            if (res.body.message === undefined) {
              errors.push('Properti message tidak ada dalam respons');
            } else if (res.body.message !== 'report sent successfully') {
              errors.push(`Properti message dalam respons bukan "report sent successfully", tetapi "${res.body.message}"`);
            }
            if (res.body.idReport === undefined) {
              errors.push('Properti idReport/Data tidak ada dalam respons');
            }
          }
          if (errors.length > 0) {
            console.log(errors.join('\n'));
            throw new Error(errors.join('\n'));
          } else {
            console.log('- test Create Report berhasil');
          }
          idReport = res.body.idReport;
          done();
        });
    });
  });
  
  describe('API Endpoints', () => {
    // Test /logout endpoint
    describe('/POST logout', () => {
      it('it should logout a user', (done) => {
        chai
          .request(server)
          .post('/logout')
          .set('Authorization', 'Bearer ' + token)
          .end((err, res) => {
            let errors = [];
            if (res.body.error === undefined) {
              errors.push('- Properti error tidak ada dalam respons');
            } else if (res.body.error !== 0) {
              errors.push(`- Properti error dalam respons bukan 0, tetapi "${res.body.error}"`);
            }
            if (res.body.message === undefined) {
              errors.push('- Properti message tidak ada dalam respons');
            } else if (res.body.message !== 'Logout successfully') {
              errors.push(`- Properti message dalam respons bukan "Logout successfully", tetapi "${res.body.message}"`);
            }
            if (errors.length > 0) {
              console.log(errors.join('\n'));
              throw new Error(errors.join('\n'));
            } else {
              console.log('- test logout berhasil');
            }
            done();
          });
      });
    });
  });

  // Fungsi untuk menghapus report
  function deleteReport(done) {
    chai
      .request(server)
      .delete('/report/' + idReport)
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        if (err) {
          console.log(`Terjadi kesalahan saat menghapus laporan: ${err.message}`);
        }
        done();
      });
  }

  afterEach(deleteReport);

  // After all tests have run
  after(function (done) {
    // Delete the test user
    User.deleteOne({ email: 'testuser@gmail.com' }, function (err) {
      if (err) {
        console.log(err);
      }
    });
    Report.deleteOne({ title: 'Test Report' }, function (err) {
      if (err) {
        console.log(err);
      }
      // Close database connection
      db.close(function () {
        done();
      });
    });
  });
});
