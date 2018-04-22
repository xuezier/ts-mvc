import * as crypto from 'crypto';

// 邮箱正则表达式
const emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
// 手机号正则表达式
const mobileReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;

/**
 * encrypt string with md5 and auto add salt
 * @param {String} str
 */
export function saltMd5(str: string): {salt: string, hash: string} {
  const buffer = new Buffer(str + '');
  let saltOrigin: string = '';
  buffer.forEach((buf: number) => {
    saltOrigin += crypto.randomBytes(buf).toString('hex');
  });
  const salt: string = md5(saltOrigin);
  const hash: string = md5(str + salt);

  const result = {salt, hash};

  return result;
}

/**
 * encrypt string with md5
 * @param {String} str
 */
export function md5(str: string): string {
  const hash = crypto.createHash('md5').update(str).digest('hex');
  return hash;
}

/**
 * check email format
 * @param {String} email
 */
export function testEmail(email: string): boolean {
  let flag = true;
  (!emailReg.test(email)) ? flag = false : flag = true;
  return flag;
}

/**
 * check mobile format
 * @param {Number} mobile
 */
export function testMobile(mobile: number): boolean {
  let flag = true;
  (!mobileReg.test(mobile)) ? flag = false : flag = true;
  return flag;
}