const LOCAL_HOST = "http://localhost:4000"

const getHost = (url = '') => {
	const isServer = typeof window === 'undefined'
	const isDev = __DEV__
	const res = `${LOCAL_HOST}${url}`
	if (isServer) return res

	// 不是服务器
	if (isDev) return res
	return url
}

export default {
	host: LOCAL_HOST,
	graphql: getHost('/graphql'),
	uploadurl: getHost('/upload'),
	ossurl: '//xiaokyoimg.oss-cn-hangzhou.aliyuncs.com/',
	socketUri: getHost('/notification'),
};
