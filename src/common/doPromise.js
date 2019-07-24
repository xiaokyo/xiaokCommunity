export default promise => {
  return promise.then (res => [null, res]).catch (err => [err]);
};
