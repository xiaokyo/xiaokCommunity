const _host = __CLIENT__ ? (__DEV__ ? '//localhost:4000' : '//xiaok.club') : 'http://localhost:4000';
export default {
	host: _host,
	uploadurl: `${_host}/upload`,
	graphql: `${_host}/graphql`,
	ossurl: '//xiaokyoimg.oss-cn-hangzhou.aliyuncs.com/',
	socketUri: `${_host}/notification`,
};
