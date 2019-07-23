const data = [];

for (let i = 0; i < 10; i++) {
  data.push ({
    id: i,
    title: '这些真相你可以早点了解一下',
    descrption: '1、我喜欢钱，是因为我没吃过钱的苦。不知道钱的坏处，只知道钱的好处。——张爱玲 2、一个人想象自己不懂得的事情，很容易浪漫。——王小波 3、我们...',
    nickname: '雨蒙_暖暖',
    commentNum: 60,
    likeNum: 145,
  });
}

export const load_postlist = () => {
  return dispatch =>
    new Promise (resolve => {
      setTimeout (() => {
        dispatch ({
          type: 'LOAD_POSTLIST',
          data,
        });

        resolve (true);
      }, 1000);
    });
};

export const load_more_postlist = () => {
  return dispatch =>
    new Promise (resolve => {
      setTimeout (() => {
        dispatch ({
          type: 'LOAD_MORE_POSTLIST',
          data,
        });
        resolve (true);
      }, 1000);
    });
};
