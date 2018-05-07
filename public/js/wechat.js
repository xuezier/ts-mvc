function jumpWechat(appid) {
  const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent('http://baidu.com/wechat/oauth')}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
  location.href = url;
}