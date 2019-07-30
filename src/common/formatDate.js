//输出格式化的日期  13位时间戳
export const formatDate = dateline => {
  let date = new Date (parseInt (dateline));
  console.log (date);
  let Y = date.getFullYear ();
  let M = date.getMonth () + 1 < 10
    ? '0' + (date.getMonth () + 1)
    : date.getMonth () + 1;
  let d = date.getDate ();
  let h = date.getHours ();
  let m = date.getMinutes ();
  let s = date.getSeconds ();

  return `${Y}.${M}.${d} ${h}:${m}`;
};
