//输出格式化的日期  13位时间戳
export const formatDate = (dateline, type = 0) => {
	let date = new Date(type == 0 ? parseInt(dateline) : dateline);
	// console.log(date);
	let Y = date.getFullYear();
	let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
	let d = date.getDate();
	d = d < 10 ? '0' + d : d;
	let h = date.getHours();
	h = h < 10 ? '0' + h : h;
	let m = date.getMinutes();
	m = m < 10 ? '0' + m : m;
	let s = date.getSeconds();

	return `${Y}.${M}.${d} ${h}:${m}`;
};
