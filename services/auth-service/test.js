import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 300,              // 100 users simultaneously
  duration: '30s',       // for 30 seconds
};

export default function () {
  const url = 'http://localhost/auth/signup';
  const payload = JSON.stringify({
    email: `test${Math.random()}@test.com`,
    password: 'Test@123',
    name: 'Load User'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'body contains accessToken': (r) => r.body.includes('accessToken'),
  });

  sleep(1); // simulate think time
}
