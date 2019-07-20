import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Input} from 'antd';
const {TextArea} = Input;

import './style.less';

export default props => {
  return (
    <div styleName="post">
      <h1 styleName="tit">男人和女人</h1>
      <div styleName="user_info">
        <Link to="/user">
          <img
            src="//upload.jianshu.io/users/upload_avatars/14561514/a53b9763-1c3a-4b05-8496-09c4ea04aa24.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/96/h/96"
            styleName="avatar"
          />
        </Link>

        <div styleName="con">
          <div styleName="top">
            <div styleName="nickname"><Link to="/user">阿莫尔女孩</Link></div>
            <Button type="primary" shape="round" size="small">
              <i className="iconfont icon-add" />关注
            </Button>
          </div>
          <div styleName="bottom">
            <span>2019.07.06</span>
            <span>阅读 26620</span>
            <span>喜欢 20</span>
            <span>评论 308</span>
          </div>
        </div>
      </div>

      <div styleName="content">
        上完床后，男人对女人说：“我们聊聊天吧。” 女人背过身去，没说话，但是却哭了。
        她知道过一会儿他会像往常一样。穿好衣服，系好扣子，撩起她的刘海给她额间一吻。
        然后说声，“下次再见。”
        最后转身离去。
        这个男人总是这么的有魅力，他不会像其他男人一样，见到她就将她扑向床，事后转身睡去。
        他总是会说：“我们聊聊天吧。”
        女人一直认为，事后还肯跟她聊天的男人才是爱她的。
        于是，天南地北，工作琐事，男人就开始跟女人聊起来，女人说得不多，但她却一字一句听得特别认真。
        男人讲话的时候还不忘抚摸女人的脸庞，也许他认为这张脸是他见过最精致的一张脸。
        可是女人更开心了，更加相信眼前的这个男人是真心爱她的。
        女人之前认识的男人，不是事后提起裤子走人，就是在说了几句之后便打起呼噜，或者是不耐烦的说自己乏了。
        眼前的这个男人，她可以为他找到各种各样的理由，譬如说：我今晚还有工作，我在这
      </div>

      <div styleName="operation">
        <Button type="primary" shape="round" size="default">
          <i className="iconfont icon-like" />
          喜欢
        </Button>
      </div>

      <div styleName="comment_input">
        <div styleName="comment_tit">评论一下吧~汪</div>
        <div styleName="comment_con">
          <TextArea rows={4} />
        </div>
        <div styleName="comment_operation">
          <Button type="primary" shape="round" size="large">回复</Button>
        </div>
      </div>

      <div styleName="reply_con">
        <div styleName="reply_tit">看看都有谁评论了~汪(10)</div>
        <ul styleName="reply_list">
          <ReplyItem />
        </ul>
      </div>

    </div>
  );
};

const ReplyItem = props => {
  return (
    <li>
      <div styleName="user_top">
        <img
          src="//upload.jianshu.io/users/upload_avatars/18601142/9a33fe8d-5405-45cc-85dd-ed9ac4c621de.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/114/h/114/format/webp"
          styleName="avatar"
        />
        <div styleName="con">
          <div styleName="username">高三刘四</div>
          <div styleName="date">2019.07.08 23:46</div>
        </div>
      </div>
      <div styleName="desc">杂念感情总让人心碎，纯洁独一的爱情才是真正的幸福！</div>

      <div styleName="tools">
        <div styleName="favour">
          <i className="iconfont icon-like" />43
        </div>

        <div styleName="reply_btn">
          <i className="iconfont icon-comment" />
          回复
        </div>
      </div>
    </li>
  );
};
