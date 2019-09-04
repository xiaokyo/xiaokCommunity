const devApiServer = "//localhost:4000";
const apiServer = "//xiaok.club";
const _host = __DEV__ ? devApiServer : apiServer;
export default {
	host: _host,
	uploadurl: `${_host}/upload`,
	graphql: `${_host}/graphql`,
	ossurl: '//xiaokyoimg.oss-cn-hangzhou.aliyuncs.com/',
	socketUri: `${_host}/notification`,
};
