// const request = require('supertest');
// const app = require('../app');
// const fs = require('fs');

// // Define test data
// const user = {
//   email: 'test@example.com',
//   username: 'testuser',
//   password: 'testpassword'
// };

// const application = {
//   fullName: 'John Doe',
//   address: '123 Main St',
//   phoneNumber: '555-1234',
//   schoolOfChoice: 'Example University',
//   certificate: fs.readFileSync('test/certificate.pdf') // Replace with path to test certificate
// };

// describe('Application endpoints', () => {
//   let authToken;

//   beforeAll(async () => {
//     // Register a user and get authentication token
//     const res = await request(app)
//       .post('/api/register')
//       .send(user);
//     expect(res.status).toBe(200);
//     authToken = res.body.token;
//   });

//   describe('POST /api/application', () => {
//     it('should create a new application', async () => {
//       const res = await request(app)
//         .post('/api/application')
//         .set('Authorization', `Bearer ${authToken}`)
//         .field('fullName', application.fullName)
//         .field('address', application.address)
//         .field('phoneNumber', application.phoneNumber)
//         .field('schoolOfChoice', application.schoolOfChoice)
//         .attach('certificate', application.certificate)
//       expect(res.status).toBe(200);
//       expect(res.body).toHaveProperty('application');
//     });

//     it('should return an error if required fields are missing', async () => {
//       const res = await request(app)
//         .post('/api/application')
//         .set('Authorization', `Bearer ${authToken}`)
//         .field('fullName', application.fullName)
//         .field('address', application.address)
//         .field('schoolOfChoice', application.schoolOfChoice)
//         .attach('certificate', application.certificate)
//       expect(res.status).toBe(400);
//       expect(res.body).toHaveProperty('message', 'Validation error');
//     });
//   });

//   describe('GET /api/application', () => {
//     it('should return the user\'s application', async () => {
//       const res = await request(app)
//         .get('/api/application')
//         .set('Authorization', `Bearer ${authToken}`)
//       expect(res.status).toBe(200);
//       expect(res.body).toHaveProperty('application');
//     });

//     it('should return an error if no application exists', async () => {
//       // Delete the user's application
//       // ...

//       const res = await request(app)
//         .get('/api/application')
//         .set('Authorization', `Bearer ${authToken}`)
//       expect(res.status).toBe(400);
//       expect(res.body).toHaveProperty('message', 'No application found');
//     });
//   });

//   describe('PUT /api/application/status', () => {
//     it('should update the application status', async () => {
//       const res = await request(app)
//         .put('/api/application/status')
//         .set('Authorization', `Bearer ${authToken}`)
//         .send({ status: 'approved' })
//       expect(res.status).toBe(200);
//       expect(res.body).toHaveProperty('application');
//       expect(res.body.application).toHaveProperty('status', 'approved');
//     });

//     it('should return an error if status is invalid', async () => {
//       const res = await request(app)
//         .put('/api/application/status')
//         .set('Authorization', `Bearer ${authToken}`)
//         .send({ status: 'invalid' })
//       expect(res.status).toBe(400);
//       expect(res.body).toHaveProperty('message', '

// Invalid status');
// });
// });

// describe('DELETE /api/application', () => {
// it('should delete the user's application', async () => {
// const res = await request(app)
// .delete('/api/application')
// .set('Authorization', Bearer ${authToken})
// expect(res.status).toBe(200);
// expect(res.body).toHaveProperty('message', 'Application deleted');
// });


// it('should return an error if no application exists', async () => {
//   const res = await request(app)
//     .delete('/api/application')
//     .set('Authorization', `Bearer ${authToken}`)
//   expect(res.status).toBe(400);
//   expect(res.body).toHaveProperty('message', 'No application found');
// });


// });
// });


















// const request = require('supertest');
// const app = require('../app');

// describe('Newsletter Endpoint', () => {
//   const newsletter = {
//     title: 'New Newsletter',
//     content: 'This is the content of the newsletter',
//   };

//   let token;

//   beforeAll(async () => {
//     const response = await request(app)
//       .post('/api/auth/login')
//       .send({ email: 'user@example.com', password: 'password' });

//     token = response.body.token;
//   });

//   it('should create a new newsletter', async () => {
//     const response = await request(app)
//       .post('/api/newsletter')
//       .set('Authorization', `Bearer ${token}`)
//       .send(newsletter)
//       .expect(201);

//     expect(response.body).toHaveProperty('title', newsletter.title);
//     expect(response.body).toHaveProperty('content', newsletter.content);
//   });

//   it('should return a list of newsletters', async () => {
//     const response = await request(app)
//       .get('/api/newsletter')
//       .set('Authorization', `Bearer ${token}`)
//       .expect(200);

//     expect(response.body).toBeInstanceOf(Array);
//     expect(response.body.length).toBeGreaterThan(0);
//   });
// });

// This test case first logs in as a user and retrieves an authentication token. It then sends a request to create a new newsletter with the token included in the Authorization header. The test checks that the response has a status code of 201 and that the returned newsletter has the correct title and content.

// The second test case retrieves a list of newsletters using the same token and checks that the response has a status code of 200 and that it returns an array with at least one item.

// You can add more test cases to cover other scenarios, such as updating or deleting a newsletter, or testing invalid input for the newsletter creation endpoint.









const userFormSignup = handleAsync(async (req, res, next) => {
    //code is for google Auth & the others are form
      let { code, username, email, password} = req.body;
    
      //google signup
      if (code) {
            const createdUser = await googleSignup(code, client);
    
            //RefreshToken saved into User model within the generateTokens function 
            const { accessToken, refreshToken } = await generateTokens(createdUser);
    
            return res.status(200).json(
              handleResponse(
                {
                  userId: createdUser._id.toString(),
                  username: createdUser.username,
                  email: createdUser.email, 
    
                  token: accessToken,
                  refreshToken: refreshToken  
                },
                "Account Created and user logged in successfully"
              )
            );
      }else {
          //Form signup
          const errors = validationResult(req);
    
          if (!errors.isEmpty())
            throw createApiError("user validation failed", 422, errors.array);
    
          if (!username || !email || !password) throw createApiError("One of fields is missing", 400);
    
          //create new user
          if (await userExist(email)) throw createApiError("email already in use", 401);
    
          const hash = await bcrypt.hash(password, 10);
          const newUser = new User({
            username: username,
            email: email,
            authenticationType: {
              form: {
                password: hash
              }
            },
          });
    
          const createdUser = await newUser.save();
    
            // RefreshToken saved into User model within the generateTokens function 
            const { accessToken, refreshToken } = await generateTokens(createdUser);
    
          res.status(201).json(
            handleResponse(
              {
             
                userId: createdUser._id.toString(),
                username: createdUser.username,
                email: createdUser.email,  
    
                token: accessToken,
                refreshToken: refreshToken, 
              },
              "Account Created and user logged in successfully"
            )
          );
      }
 });

const userLogin = handleAsync(async (req, res, next) => {
    var { email, password, code } = req.body;
    let user;
  
    //Google Login
    if (code) {
      const tokenId = await getAccessToken(code, client);
      const payload = await verify(tokenId, client);
      email = payload["email"];
  
      user = await User.findOne({ email: email });
      if (!user)
        user = await googleSignup(code, client, payload);
      
    } else {
      user = await User.findOne({ email: email });
      if (!user)
        throw createApiError("A user for this email could not be found!", 401);
  
      const isEqual = await bcrypt.compare(
        password,
        user.authenticationType.form.password
      );
  
      if (!isEqual) throw createApiError("Wrong password!", 401);
    }
  
    //form login
    const { accessToken, refreshToken } = await generateTokens(user);
  
    return res.status(201).json(
      handleResponse(
        {
          userId: user._id.toString(),
          username: user.username,
          email: user.email,  
  
          token: accessToken, 
          refreshToken: refreshToken,
        },
        "user logged in successfully"
      )
    );
  });