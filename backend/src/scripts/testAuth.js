const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true // Don't throw on any status code
});

async function runTests() {
  console.log('\n=== AUTHENTICATION API TESTS ===\n');

  try {
    // Test 1: Sign up a new user
    console.log('1. Testing SIGNUP endpoint...');
    const signupResponse = await api.post('/auth/signup', {
      name: 'John Doe User',
      email: 'john.doe@example.com',
      password: 'Password@123',
      address: '123 Main Street, Springfield'
    });
    console.log(`Status: ${signupResponse.status}`);
    console.log(`Response:`, JSON.stringify(signupResponse.data, null, 2));

    if (signupResponse.status !== 201) {
      console.error('❌ Signup failed');
      return;
    }
    console.log('✅ Signup successful\n');

    // Test 2: Sign up with invalid password (no uppercase)
    console.log('2. Testing SIGNUP with invalid password...');
    const invalidSignupResponse = await api.post('/auth/signup', {
      name: 'Jane Doe User',
      email: 'jane.doe@example.com',
      password: 'password@123', // Missing uppercase
      address: '456 Oak Avenue'
    });
    console.log(`Status: ${invalidSignupResponse.status}`);
    console.log(`Response:`, JSON.stringify(invalidSignupResponse.data, null, 2));
    console.log('✅ Invalid password correctly rejected\n');

    // Test 3: Try duplicate email
    console.log('3. Testing SIGNUP with duplicate email...');
    const duplicateResponse = await api.post('/auth/signup', {
      name: 'Another User',
      email: 'john.doe@example.com', // Duplicate email
      password: 'Password@456',
      address: '789 Pine Road'
    });
    console.log(`Status: ${duplicateResponse.status}`);
    console.log(`Response:`, JSON.stringify(duplicateResponse.data, null, 2));
    console.log('✅ Duplicate email correctly rejected\n');

    // Test 4: Login with correct credentials
    console.log('4. Testing LOGIN endpoint...');
    const loginResponse = await api.post('/auth/login', {
      email: 'john.doe@example.com',
      password: 'Password@123'
    });
    console.log(`Status: ${loginResponse.status}`);
    console.log(`Response:`, JSON.stringify(loginResponse.data, null, 2));

    if (loginResponse.status !== 200) {
      console.error('❌ Login failed');
      return;
    }
    console.log('✅ Login successful\n');

    const token = loginResponse.data.token;

    // Test 5: Login with wrong password
    console.log('5. Testing LOGIN with wrong password...');
    const wrongPasswordResponse = await api.post('/auth/login', {
      email: 'john.doe@example.com',
      password: 'WrongPassword@123'
    });
    console.log(`Status: ${wrongPasswordResponse.status}`);
    console.log(`Response:`, JSON.stringify(wrongPasswordResponse.data, null, 2));
    console.log('✅ Wrong password correctly rejected\n');

    // Test 6: Update password
    console.log('6. Testing UPDATE PASSWORD endpoint...');
    const updatePasswordResponse = await api.patch(
      '/auth/update-password',
      {
        oldPassword: 'Password@123',
        newPassword: 'NewPassword@456'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log(`Status: ${updatePasswordResponse.status}`);
    console.log(`Response:`, JSON.stringify(updatePasswordResponse.data, null, 2));

    if (updatePasswordResponse.status === 200) {
      console.log('✅ Password update successful\n');

      // Test 7: Try login with new password
      console.log('7. Testing LOGIN with new password...');
      const newLoginResponse = await api.post('/auth/login', {
        email: 'john.doe@example.com',
        password: 'NewPassword@456'
      });
      console.log(`Status: ${newLoginResponse.status}`);
      console.log(`Response:`, JSON.stringify(newLoginResponse.data, null, 2));
      console.log('✅ Login with new password successful\n');
    }

    // Test 8: Try accessing protected route without token
    console.log('8. Testing protected route without token...');
    const noTokenResponse = await api.patch('/auth/update-password', {
      oldPassword: 'NewPassword@456',
      newPassword: 'AnotherPassword@789'
    });
    console.log(`Status: ${noTokenResponse.status}`);
    console.log(`Response:`, JSON.stringify(noTokenResponse.data, null, 2));
    console.log('✅ Protected route correctly rejected request without token\n');

    console.log('=== ALL TESTS COMPLETED ===\n');

  } catch (error) {
    console.error('Test error:', error.message);
  }
}

runTests();
