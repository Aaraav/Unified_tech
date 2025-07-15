const { signup, login, logout, refresh } =require('./auth');

(async () => {
  try {
    const res = await signup({
      email: 'tesgfdwt@example.com',
      password: '123456',
      name: 'Test User'
    });
    console.log('Signup Success:', res);

    const loginRes = await login({
      email: 'tesgt@example.com',
      password: '123456',
    });
    console.log('Login Success:', loginRes);

    // const refreshed = await refresh(loginRes.refreshToken);
    // console.log('Refreshed Token:', refreshed);

    const logoutRes = await logout(loginRes.refreshToken);
    console.log('Logged out:', logoutRes);

  } catch (err) {
    console.error('SDK Test Error:', err.response?.data || err.message);
  }
})();
