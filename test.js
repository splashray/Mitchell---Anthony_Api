
const request = require('supertest');
const app = require('../app');



//In the above code, we are using the `supertest` library to make HTTP requests to our endpoints, and the `expect` library to make assertions about the responses we receive. We have created two test suites, one for the user registration endpoint and one for the login endpoint, and each suite contains one test case.
 
// Run the tests using the Mocha command:

// This will run all the test files in the `test` directory. Of course, this is just an example, and you will need to modify the test cases to fit your specific implementation. But hopefully, this gives you an idea of how to use Mocha and `supertest` to test your Node.js endpoints.




describe('Authentication', () => {
  describe('POST /api/auth/register', () => {
    it('should return 201 status code and create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'testpassword'
        });
        
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'User created successfully');
      expect(res.body).toHaveProperty('data');
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should return 200 status code and authenticate the user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword'
        });
        
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'User authenticated successfully');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHave
  Property('token');
});

})

})






// npm install mocha supertest chai

const request = require('supertest');
const app = require('../app');
const chai = require('chai');
const expect = chai.expect;

describe('Application Form Endpoint', () => {
  describe('POST /application', () => {
    it('should return a 400 status code if required fields are missing', (done) => {
      const applicationData = {
        fullName: 'John Doe',
        address: '123 Main St.',
        phoneNumber: '555-555-5555',
        schoolOfChoice: 'ABC University',
        // certificatePdf is missing
      };
      
      request(app)
        .post('/application')
        .send(applicationData)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).to.equal('"certificatePdf" is required');
          done();
        });
    });
    
    it('should return a 200 status code and success message if all required fields are provided', (done) => {
      const applicationData = {
        fullName: 'John Doe',
        address: '123 Main St.',
        phoneNumber: '555-555-5555',
        schoolOfChoice: 'ABC University',
        certificatePdf: 'test.pdf',
      };
      
      request(app)
        .post('/application')
        .send(applicationData)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).to.equal('Application submitted successfully');
          done();
        });
    });
  });
});

// In the above code, we have created two test cases for the POST /application endpoint. The first test case checks that a 400 status code is returned if any required fields are missing from the request body, and that the error









//npm install mocha supertest --save-dev
const request = require('supertest');
const app = require('../app');

describe('Application form endpoint', () => {
  // Test case for successful form submission
  it('should submit application form successfully', async () => {
    // Define the form data
    const formData = {
      fullName: 'John Doe',
      address: '123 Main St',
      phoneNumber: '555-1234',
      schoolOfChoice: 'University of Example',
      certificate: 'certificate.pdf',
    };

    // Send a POST request to the endpoint with the form data
    const res = await request(app)
      .post('/application-form')
      .send(formData)
      .expect(201);

    // Check that the response contains the correct message
    expect(res.body.message).to.equal('Application form submitted successfully');
  });

  // Test case for form submission with missing required fields
  it('should return an error for missing required fields', async () => {
    // Define the form data with missing required fields
    const formData = {
      fullName: 'John Doe',
      address: '123 Main St',
      phoneNumber: '555-1234',
    };

    // Send a POST request to the endpoint with the form data
    const res = await request(app)
      .post('/application-form')
      .send(formData)
      .expect(400);

    // Check that the response contains the correct error message
    expect(res.body.error).to.equal('ValidationError');
    expect(res.body.message).to.equal('Validation failed');
  });

  // Test case for form submission with

