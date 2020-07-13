export const delHtmlTag = str => {
  if (typeof str != 'string') return '';
  if (str.length <= 0) return '';
  return str.replace(/<[^>]+>/g, '').substring(0, 400); //去掉所有的html标记
};
