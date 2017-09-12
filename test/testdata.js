module.exports = {
  valid_jwt: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.8qZF8vbN3UpcanXFc-mPXJkOPN01-bRch8XX3rToP1U',
    payload: {
      sub: '1'
    },
    secret: 'secret'
  },
  valid_jwt_with_another_secret: {
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.rbRUk2g1Rifi3klfYOV6Z1unf3xfRWMRP8JBIHVDYzw',
    payload: {
      'sub': '1'
    },
    secret: 'anothersecret'
  },
  user: {
    name: 'leilei',
    email: 'adcentury100@gmail.com'
  }
};
