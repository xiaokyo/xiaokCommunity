import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Mock from 'mockjs';

const reqMock = new MockAdapter (axios);

//login
reqMock.onPost ('/login').reply (200, {
  userid: 1,
  username: 'xiaokyo',
  accessToken: 'fsadfsdfsfdsaf545646',
});

//profile
reqMock.onGet ('/profile').reply (200, {
  userid: 1,
  username: 'xiaokyo',
  accessToken: 'fsadfsdfsfdsaf545646',
});

//帖子列表
reqMock.onGet ('/postList').reply (
  200,
  Mock.mock ({
    'data|10': [
      {
        'id|+1': 1,
        title: '@title',
        descrption: '@cparagraph',
        nickname: '@first',
        'commentNum|60-1000': 200,
        'likeNum|60-1000': 200,
        // commentNum: 60,
        // likeNum: 145,
      },
    ],
  })
);

//更多帖子
reqMock.onGet ('/loadMorePost').reply (
  200,
  Mock.mock ({
    'data|10': [
      {
        'id|+1': 1,
        title: '@title',
        descrption: '@cparagraph',
        nickname: '@first',
        'commentNum|60-1000': 200,
        'likeNum|60-1000': 200,
        // commentNum: 60,
        // likeNum: 145,
      },
    ],
  })
);
