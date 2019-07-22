export const getPostById = id => {
  return postsState => {
    let currentPost = null;
    let isExist = postsState.some (item => {
      // console.log (item);
      currentPost = item;
      return item.id === id;
    });

    // let isExist = false;
    // for (let i = 0; i < postsState.length; i++) {
    //   if (postsState[i].id === id) {
    //     currentPost = postsState[i];
    //     isExist = true;
    //     break;
    //   }
    // }

    if (isExist) {
      return currentPost;
    }

    return {};
  };
};

export const savePostById = id => {
  return dispatch =>
    new Promise (resolve => {
      //请求postbyid
      setTimeout (() => {
        dispatch ({
          type: 'SAVE_POST_BY_ID',
          data: {
            id,
            title: '21 个VSCode 快捷键，让代码更快，更有趣',
            content: '做为前端开发者来说，大都数都用过 VSCode，并且也有很多是经常用的。但 VSCode 的一些快捷键可能我们不知道，也比较少用，毕竟这很好，因此本文就列出一些快捷键方便大家学习与记忆。在这篇文章中，我将列出我最喜欢的快捷键，这些快捷键让我更快的编写代码，也让编码变得更有趣，以下是21 个 VSCode 快捷键，分享给你。',
            commentNum: 20,
            likeNum: 211,
            createDate: '2019.06.07 20:22',
            user: {
              id: 2545,
              username: '前端小智',
              avatar: '//mirror-gold-cdn.xitu.io/168e08a02f4dda88289?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1',
            },
          },
        });
        resolve (true);
      }, 2000);
    });
};
