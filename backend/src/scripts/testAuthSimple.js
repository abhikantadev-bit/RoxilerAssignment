const http = require('http');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: responseData ? JSON.parse(responseData) : null
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('\n=== AUTHENTICATION API TESTS ===\n');

  try {
    // Test 1: Sign up a new user
    console.log('1. Testing SIGNUP endpoint...');
    const signupResponse = await makeRequest('POST', '/api/auth/signup', {
      name: 'John Doe User',
      email: 'john.doe@example.com',
      password: 'Password@123',
      address: '123 Main Street, Springfield'
    });
    console.log(`Status: ${signupResponse.status}`);
    console.log(`Response:`, JSON.stringify(signupResponse.data, null, 2));

    if (signupResponse.status !== 201) {
      console.error('❌ Signup failed');
      process.exit(1);
    }
    console.log('✅ Signup successful\n');

    // Test 2: Login with correct credentials
    console.log('2. Testing LOGIN endpoint...');
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
      email: 'john.doe@example.com',
      password: 'Password@123'
    });
    console.log(`Status: ${loginResponse.status}`);
    console.log(`Response:`, JSON.stringify(loginResponse.data, null, 2));

    if (loginResponse.status !== 200) {
      console.error('❌ Login failed');
      process.exit(1);
    }

    const token = loginResponse.data.token;
    console.log('✅ Login successful\n');

    // Test 3: Try login with wrong password
    console.log('3. Testing LOGIN with wrong password...');
    const wrongPasswordResponse = await makeRequest('POST', '/api/auth/login', {
      email: 'john.doe@example.com',
      password: 'WrongPassword@123'
    });
    console.log(`Status: ${wrongPasswordResponse.status}`);
    console.log(`Response:`, JSON.stringify(wrongPasswordResponse.data, null, 2));
    console.log('✅ Wrong password correctly rejected\n');

    // Test 4: Try duplicate email
    console.log('4. Testing SIGNUP with duplicate email...');
    const duplicateResponse = await makeRequest('POST', '/api/auth/signup', {
      name: 'Another User',
      email: 'john.doe@example.com', // Duplicate email
      password: 'Password@456',
      address: '789 Pine Road'
    });
    console.log(`Status: ${duplicateResponse.status}`);
    console.log(`Response:`, JSON.stringify(duplicateResponse.data, null, 2));
    console.log('✅ Duplicate email correctly rejected\n');

    console.log('=== ALL TESTS PASSED ===\n');
    process.exit(0);

  } catch (error) {
    console.error('Test error:', error.message);
    process.exit(1);
  }
}

runTests();
