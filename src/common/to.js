/**处理异步异常 */
export default promise => promise.then(res => [null, res]).catch(err => [err]);
