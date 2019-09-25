const devApiServer = "//localhost:4000";
const apiServer = "//www.xiaok.club";
const _host = __DEV__ ? devApiServer : apiServer;
const isServer = typeof window === 'undefined';
export default {
	host: _host,
	graphql: `${isServer ? `http:${devApiServer}` : ''}/graphql`,
	uploadurl: `/upload`,
	ossurl: '//xiaokyoimg.oss-cn-hangzhou.aliyuncs.com/',
	socketUri: `/notification`,
};
