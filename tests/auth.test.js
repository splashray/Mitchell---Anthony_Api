// const request = require('supertest');
// const app = require('../app'); // import your Express server
// const { connect, disconnect } = require('../database/dbConn'); // import your database connection
// const { createUser } = require('../controllers/authController'); // import your auth controller
// const { User } = require('../models/userModel'); // import your user model

// describe('Authentication Flow', () => {
//   let db;
//   let accessToken;
//   let refreshToken;
//   let user;

//   beforeAll(async () => {
//     db = await connect(); // connect to database
//     user = await createUser('testuser@gmail.com', 'testpassword'); // create a test user
//   });

//   afterAll(async () => {
//     await User.deleteMany({}); // delete all users after tests
//     await disconnect(); // disconnect from database
//   });

//   describe('POST /auth/login', () => {
//     it('should login a user and return access and refresh tokens', async () => {
//       const res = await request(app).post('/auth/login').send({
//         email: 'testuser@gmail.com',
//         password: 'testpassword',
//       });
//       expect(res.statusCode).toEqual(200);
//       expect(res.body).toHaveProperty('data');
//       expect(res.body.message).toEqual('User login successful');
//       expect(res.body.data).toHaveProperty('accessToken');
//       expect(res.body.data).toHaveProperty('refreshToken');
//       accessToken = res.body.data.accessToken;
//       refreshToken = res.body.data.refreshToken;
//     });

//     it('should not login a user with incorrect password', async () => {
//       const res = await request(app).post('/auth/login').send({
//         username: 'testuser',
//         password: 'incorrectpassword',
//       });
//       expect(res.statusCode).toEqual(401);
//       expect(res.body).toHaveProperty('error');
//       expect(res.body.error).toEqual('Invalid credentials');
//     });

//     it('should not login a non-existent user', async () => {
//       const res = await request(app).post('/auth/login').send({
//         username: 'nonexistentuser',
//         password: 'testpassword',
//       });
//       expect(res.statusCode).toEqual(401);
//       expect(res.body).toHaveProperty('error');
//       expect(res.body.error).toEqual('Invalid credentials');
//     });
//   });

//   describe('POST /auth/refresh', () => {
//     it('should refresh access token', async () => {
//       const res = await request(app).post('/auth/refresh').send({
//         refreshToken,
//       });
//       expect(res.statusCode).toEqual(200);
//       expect(res.body).toHaveProperty('data');
//       expect(res.body.message).toEqual('Access token created successfully');
//       accessToken = res.body.data.accessToken;
//     });

//     it('should not refresh access token with invalid refresh token', async () => {
//       const res = await request(app).post('/auth/refresh').send({
//         refreshToken: 'invalidrefreshtoken',
//       });
//       expect(res.statusCode).toEqual(401);
//       expect(res.body).toHaveProperty('error');
//       expect(res.body.error).toEqual('Invalid refresh token');
//     });
//   });

// });



test('hello world!', ()=>{

})

