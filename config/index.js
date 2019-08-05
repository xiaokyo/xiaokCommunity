const _host = __CLIENT__ ? 'http://localhost:3000' : 'http://localhost:3000';
export default {
	host: _host,
	uploadurl: `${_host}/upload`,
	graphql: `${_host}/graphql`,
	ossurl: '//xiaokyoimg.oss-cn-hangzhou.aliyuncs.com/',
};
