import * as authApi from '../auth';


/* 
 for test when get API delete this
 */
export async function runAuthApiSelfTest() {
  console.log('Auth API Self Test ');

  // Test 1: register
  const reg = await authApi.register({
    name: 'Test',
    email: 'test@example.com',
    password: 'Abcdefg1',
  });
  console.log('1. Register:', reg);

  // Test 2: setup2FA
  const setup = await authApi.setup2FA(reg.tempToken);
  console.log('2. Setup2FA:', setup);

  // Test 3: wrong code
  try {await authApi.verify2FA({ tempToken: reg.tempToken, code: '000000' });
  } catch (err) { console.log('3. Wrong code:', err);
  }



  // Test 4: correct code
  const verified = await authApi.verify2FA({
 tempToken: reg.tempToken,
    code: '123456',
  });
  console.log('4. Verified:', verified);

  // Test 5: login with 2FA
  const login = await authApi.login({
    email: 'test@example.com',
    password: 'Abcdefg1',
  });
  console.log('5. Login with 2FA:', login);

  console.log('Done ');
}