function jumpWechat(appid, server) {
  const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(server + '/wechat/oauth')}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
  location.href = url;
}