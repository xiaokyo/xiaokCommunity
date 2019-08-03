import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Input, message, Modal, Divider } from 'antd';
import Loading from '@components/loading';
const { TextArea } = Input;
import { formatDate } from '@common/formatDate';
//style
import 'braft-editor/dist/output.css';
import './style.less';

//graphql
import { graphql } from '@graphql';

//actions
import { getPostById, savePostById } from '@redux/actions/posts';

export default props => {
	// console.log ('render');
	const postid = props.match.params.id;
	const dispacth = useDispatch();
	const posts = useSelector(state => state.posts);
	const userInfo = useSelector(state => state.userInfo);
	const currentPost = getPostById(postid)(posts);
	const [replyVal, setReplyVal] = useState('');
	const [comments, setComments] = useState([]);

	//删除当前帖子
	const delPost = async () => {
		const args = `{
			delPost(_id:"${postid}"){
				success
				msg
			}
		}`;

		const [err, res] = await graphql({ type: 'mutation', args });
		if (err) return;
		const { success, msg } = res.data.delPost;
		if (!success) return message.warn(msg);
		message.success(msg);
		window.location.href = '/';
	};

	//获取comments
	const getComments = async () => {
		const args = `{
			getComments(postid:"${postid}"){
				_id
				content
				user{
					_id
					username
					avatar
				}
				createDate
				comment_response{
					user{
						_id
						username
					}
					toUser{
						_id
						username
					}
					response_content
					createDate
				}
			}
		}`;

		const [err, res] = await graphql({ args });
		if (err) return;
		// console.log(res.data.getComments);
		setComments([...res.data.getComments]);
	};

	//评论
	const addComment = async () => {
		if (!replyVal) return message.warn('请输入想要说的话');
		const args = `{
			addComment(postid:"${postid}",content:"${replyVal}"){
				success
				comment{
					_id
					content
					user{
						_id
						username
						avatar
					}
					createDate
					comment_response{
						user{
							_id
							username
						}
						toUser{
							_id
							username
						}
						response_content
						createDate
					}
				}
			}
		}`;

		const [err, res] = await graphql({ type: 'mutation', args });
		if (err) return;
		if (!res.data.addComment.success) return;
		message.success('回复成功');
		setComments([res.data.addComment.comment, ...comments]);
		setReplyVal('');
	};

	//加载redux此id未有的帖子详情
	useEffect(() => {
		if (!currentPost.title) {
			savePostById(postid)(dispacth);
		}
		getComments();
	}, []);

	return (
		<div>
			{!currentPost.title ? (
				<Loading />
			) : (
				<div styleName="post">
					<h1 styleName="tit">{currentPost.title}</h1>
					<div styleName="user_info">
						<Link to={`/user/${currentPost.user._id}`}>
							<img src={currentPost.user.avatar} styleName="avatar" />
						</Link>
						<div styleName="con">
							<div styleName="top">
								<div styleName="nickname">
									<Link to={`/user/${currentPost.user._id}`}>{currentPost.user.username}</Link>
								</div>
								{/* <Button type="primary" shape="round" size="small">
                    <i className="iconfont icon-add" />关注
                  </Button> */}
							</div>
							<div styleName="bottom">
								<span>{formatDate(currentPost.createDate)}</span>
								{userInfo.my && userInfo.my._id === currentPost.user._id ? (
									<>
										<span>
											<Link to={`/sendPost?postid=${postid}`}>编辑</Link>
										</span>
										<span>
											<a href="#" onClick={delPost}>
												删除
											</a>
										</span>
									</>
								) : (
									''
								)}
								{/* <span>阅读 26620</span> */}
								{/* <span>喜欢 {currentPost.like}</span> */}
								{/* <span>评论 {currentPost.commentNum}</span> */}
							</div>
						</div>
					</div>

					<div styleName="content">
						<div
							className="braft-output-content"
							dangerouslySetInnerHTML={{ __html: currentPost.content }}
						/>
					</div>

					{/* <div styleName="operation">
						<Button type="primary" shape="round" size="default">
							<i className="iconfont icon-like" />
							喜欢
						</Button>
					</div> */}

					<Divider />

					<div styleName="comment_input">
						<div styleName="comment_tit">评论一下吧~汪</div>
						<div styleName="comment_con">
							<TextArea rows={4} value={replyVal} onChange={e => setReplyVal(e.target.value)} />
						</div>
						<div styleName="comment_operation">
							<Button
								type="primary"
								shape="round"
								size="large"
								onClick={() => {
									if (!userInfo.my) return message.warn('请先登入');
									addComment();
								}}
							>
								回复
							</Button>
						</div>
					</div>

					<div styleName="reply_con">
						<div styleName="reply_tit">看看都有谁评论了~汪({comments.length})</div>
						<ul styleName="reply_list">
							{comments.map(item => (
								<ReplyItem key={item._id} {...item} />
							))}
						</ul>
						{comments.length <= 0 ? '暂无评论' : ''}
					</div>
				</div>
			)}
		</div>
	);
};

const ReplyItem = ({ _id, postid, user, content, createDate, comment_response }) => {
	const [show, setShow] = useState(false);
	const userInfo = useSelector(state => state.userInfo);
	const [replyComments, setReplyComments] = useState(comment_response);

	return (
		<li>
			<div styleName="user_top">
				<Link to={`/user/${user._id}`}>
					<img src={user.avatar} styleName="avatar" />
				</Link>
				<div styleName="con">
					<div styleName="username">{user.username}</div>
					<div styleName="date">{formatDate(createDate)}</div>
				</div>
			</div>
			<div styleName="desc">{content}</div>

			<div styleName="tools">
				{/* <div styleName="favour">
					<i className="iconfont icon-like" />
					43
				</div> */}
				{userInfo.my && userInfo.my._id === user._id ? (
					''
				) : (
					<div
						styleName="reply_btn"
						onClick={() => {
							if (!userInfo.my) return message.warn('请先登入');
							setShow(!show);
						}}
					>
						<i className="iconfont icon-comment" />
						回复
					</div>
				)}
			</div>

			<ModalReplyComment
				show={show}
				setShow={setShow}
				toUser={user}
				commentid={_id}
				replyComments={replyComments}
				setReplyComments={setReplyComments}
			/>

			{replyComments.length > 0 ? (
				<div styleName="reply_to_comment">
					{replyComments.map((item, index) => (
						<ReplyCommentItem
							key={item.createDate}
							{...item}
							commentid={_id}
							replyComments={replyComments}
							setReplyComments={setReplyComments}
						/>
					))}
				</div>
			) : (
				''
			)}
		</li>
	);
};

//replyCommentItem
const ReplyCommentItem = ({
	user,
	toUser,
	response_content,
	createDate,
	commentid,
	replyComments,
	setReplyComments,
}) => {
	const [show, setShow] = useState(false);
	const userInfo = useSelector(state => state.userInfo);
	return (
		<div styleName="_item">
			<div styleName="top">
				<a href="">{user.username}</a>回复<a href="">{toUser.username}</a>
				<span styleName="_con">{response_content}</span>
			</div>
			<div styleName="bottom">
				<span styleName="_date">{formatDate(createDate)}</span>
				{userInfo.my && userInfo.my._id === user._id ? (
					''
				) : (
					<div
						styleName="_reply_btn"
						onClick={() => {
							if (!userInfo.my) return message.warn('请先登入');
							setShow(!show);
						}}
					>
						<i className="iconfont icon-comment" />
						<span>回复</span>
					</div>
				)}
			</div>
			<ModalReplyComment
				show={show}
				setShow={setShow}
				toUser={user}
				commentid={commentid}
				replyComments={replyComments}
				setReplyComments={setReplyComments}
			/>
		</div>
	);
};

//弹窗回复
const ModalReplyComment = ({ show, setShow, toUser, commentid, replyComments, setReplyComments }) => {
	const [content, setContent] = useState('');
	const userInfo = useSelector(state => state.userInfo);
	const onOk = async () => {
		if (!content) return message.warn('不能为空');
		let args = `{
			addCommentReply(commentid:"${commentid}",content:"${content}",touserid:"${toUser._id}"){
				success
				msg
			}
		}`;

		const [err, res] = await graphql({ type: 'mutation', args });
		if (err) return message.warn(err);
		message.success('回复成功');
		setReplyComments([
			...replyComments,
			{
				createDate: new Date().getTime().toString(),
				response_content: content,
				toUser,
				user: { _id: userInfo.my._id, username: userInfo.my.username },
			},
		]);
		setShow(false);
	};

	return (
		<Modal title={`回复:${toUser.username}`} visible={show} onOk={onOk} onCancel={() => setShow(false)}>
			<TextArea rows={4} value={content} onChange={e => setContent(e.target.value)} />
		</Modal>
	);
};
