export const DefinedErrors = {
  'invalid_register': {
    status: 400,
    description: 'the registration information is incomplete'
  },
  'user_exists': {
    status: 400,
    description: 'user has registered'
  },
  'put_nothing': {
    status: 400,
    description: 'send nothing to modify'
  },
  'invalid_refreshToken': {
    status: 403
  },
  'invalid_refreshToken_expire': {
    status: 403
  },
  'invalid_clientSecret': {
    status: 403
  },
  'invalid_password': {
    status: 403,
    description: 'wrong password'
  },
  'invalid_accessToken': {
    status: 401,
  },
  'invalid_accessToken_expire': {
    status: 401
  },
  'limit_mobile_code': {
    status: 400,
    description: 'get mobile verify code frequently'
  },
  'limit_mobile_request': {
    status: 400,
    description: 'get mobile verify code too many times in dayly'
  },
  'code_not_null': {
    status: 400,
    description: 'not send a code',
  },
  'invalid_code': {
    status: 400,
    description: 'code expired or wrong'
  },
  'invalid_password_length': {
    status: 400,
    description: 'set password length invalid'
  },
  'invalid_mobile': {
    status: 400,
    description: 'send a wrong mobile number'
  },
  'invalid_email': {
    status: 400,
    description: 'send a wrong email number'
  }
}