const request = require('supertest');
const app = require('../app');
const fs = require('fs');

// Define test data
const user = {
  email: 'test@example.com',
  username: 'testuser',
  password: 'testpassword'
};

const application = {
  fullName: 'John Doe',
  address: '123 Main St',
  phoneNumber: '555-1234',
  schoolOfChoice: 'Example University',
  certificate: fs.readFileSync('test/certificate.pdf') // Replace with path to test certificate
};

describe('Application endpoints', () => {
  let authToken;

  beforeAll(async () => {
    // Register a user and get authentication token
    const res = await request(app)
      .post('/api/register')
      .send(user);
    expect(res.status).toBe(200);
    authToken = res.body.token;
  });

  describe('POST /api/application', () => {
    it('should create a new application', async () => {
      const res = await request(app)
        .post('/api/application')
        .set('Authorization', `Bearer ${authToken}`)
        .field('fullName', application.fullName)
        .field('address', application.address)
        .field('phoneNumber', application.phoneNumber)
        .field('schoolOfChoice', application.schoolOfChoice)
        .attach('certificate', application.certificate)
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('application');
    });

    it('should return an error if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/application')
        .set('Authorization', `Bearer ${authToken}`)
        .field('fullName', application.fullName)
        .field('address', application.address)
        .field('schoolOfChoice', application.schoolOfChoice)
        .attach('certificate', application.certificate)
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Validation error');
    });
  });

  describe('GET /api/application', () => {
    it('should return the user\'s application', async () => {
      const res = await request(app)
        .get('/api/application')
        .set('Authorization', `Bearer ${authToken}`)
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('application');
    });

    it('should return an error if no application exists', async () => {
      // Delete the user's application
      // ...

      const res = await request(app)
        .get('/api/application')
        .set('Authorization', `Bearer ${authToken}`)
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'No application found');
    });
  });

  describe('PUT /api/application/status', () => {
    it('should update the application status', async () => {
      const res = await request(app)
        .put('/api/application/status')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'approved' })
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('application');
      expect(res.body.application).toHaveProperty('status', 'approved');
    });

    it('should return an error if status is invalid', async () => {
      const res = await request(app)
        .put('/api/application/status')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'invalid' })
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', '

Invalid status');
});
});

describe('DELETE /api/application', () => {
it('should delete the user's application', async () => {
const res = await request(app)
.delete('/api/application')
.set('Authorization', Bearer ${authToken})
expect(res.status).toBe(200);
expect(res.body).toHaveProperty('message', 'Application deleted');
});


it('should return an error if no application exists', async () => {
  const res = await request(app)
    .delete('/api/application')
    .set('Authorization', `Bearer ${authToken}`)
  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty('message', 'No application found');
});


});
});


















const request = require('supertest');
const app = require('../app');

describe('Newsletter Endpoint', () => {
  const newsletter = {
    title: 'New Newsletter',
    content: 'This is the content of the newsletter',
  };

  let token;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password' });

    token = response.body.token;
  });

  it('should create a new newsletter', async () => {
    const response = await request(app)
      .post('/api/newsletter')
      .set('Authorization', `Bearer ${token}`)
      .send(newsletter)
      .expect(201);

    expect(response.body).toHaveProperty('title', newsletter.title);
    expect(response.body).toHaveProperty('content', newsletter.content);
  });

  it('should return a list of newsletters', async () => {
    const response = await request(app)
      .get('/api/newsletter')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

This test case first logs in as a user and retrieves an authentication token. It then sends a request to create a new newsletter with the token included in the Authorization header. The test checks that the response has a status code of 201 and that the returned newsletter has the correct title and content.

The second test case retrieves a list of newsletters using the same token and checks that the response has a status code of 200 and that it returns an array with at least one item.

You can add more test cases to cover other scenarios, such as updating or deleting a newsletter, or testing invalid input for the newsletter creation endpoint.
