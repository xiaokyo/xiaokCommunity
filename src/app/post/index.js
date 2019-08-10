import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MetaTags from 'react-meta-tags';
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
import { getPostById, savePostById, like } from '@redux/actions/posts';

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
		if (!confirm('确认删除此贴?')) return;
		const args = `delPost($_id:String!){
			delPost(_id:$_id){
				success
				msg
			}
		}`;

		const [err, res] = await graphql({ type: 'mutation', args, variables: { _id: postid } });
		if (err) return;
		const { success, msg } = res.delPost;
		if (!success) return message.warn(msg);
		message.success(msg);
		window.location.href = '/';
	};

	//获取comments
	const getComments = async () => {
		const args = `getComments($postid:String!){
			getComments(postid:$postid){
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
					to_user{
						_id
						username
					}
					content
					createDate
				}
			}
		}`;

		const [err, res] = await graphql({ args, variables: { postid } });
		if (err) return;
		// console.log(res.data.getComments);
		setComments([...res.getComments]);
	};

	//评论
	const addComment = async () => {
		if (!replyVal) return message.warn('请输入想要说的话');
		const args = `addComment($postid:String!,$content:String!){
			addComment(postid:$postid,content:$content){
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
						to_user{
							_id
							username
						}
						content
						createDate
					}
				}
			}
		}`;

		const [err, res] = await graphql({ type: 'mutation', args, variables: { postid, content: replyVal } });
		if (err) return;
		if (!res.addComment.success) return;
		message.success('回复成功');
		setComments([res.addComment.comment, ...comments]);
		setReplyVal('');
	};

	//喜欢
	const likethis = () => {
		if (!userInfo.my) return message.warn('请先登入');
		like(postid, currentPost)(dispacth);
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
					<MetaTags>
						<title>{currentPost.title}-xiaokyo</title>
						<meta name="description" content="一个简约的交流社区" />
					</MetaTags>
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
								{/* <span>阅读 26620</span> */}
								<span>喜欢 {currentPost.like_count}</span>
								<span>评论 {comments.length}</span>
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
							</div>
						</div>
					</div>

					<div styleName="content">
						<div
							className="braft-output-content"
							dangerouslySetInnerHTML={{ __html: currentPost.content }}
						/>
					</div>

					<div styleName="operation">
						<Button type="primary" shape="round" size="default" onClick={likethis}>
							<i
								className={`iconfont ${
									currentPost && currentPost.like ? 'icon-likefill' : 'icon-like'
								}`}
							/>
							喜欢
						</Button>
					</div>

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
				to_user={user}
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
const ReplyCommentItem = ({ user, to_user, content, createDate, commentid, replyComments, setReplyComments }) => {
	const [show, setShow] = useState(false);
	const userInfo = useSelector(state => state.userInfo);
	return (
		<div styleName="_item">
			<div styleName="top">
				<a href="">{user.username}</a>回复<a href="">{to_user.username}</a>
				<span styleName="_con">{content}</span>
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
				to_user={user}
				commentid={commentid}
				replyComments={replyComments}
				setReplyComments={setReplyComments}
			/>
		</div>
	);
};

//弹窗回复
const ModalReplyComment = ({ show, setShow, to_user, commentid, replyComments, setReplyComments }) => {
	const [content, setContent] = useState('');
	const userInfo = useSelector(state => state.userInfo);
	const onOk = async () => {
		if (!content) return message.warn('不能为空');
		let args = `{
			addCommentReply(commentid:"${commentid}",content:"${content}",touserid:"${to_user._id}"){
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
				to_user,
				user: { _id: userInfo.my._id, username: userInfo.my.username },
			},
		]);
		setShow(false);
	};

	return (
		<Modal title={`回复:${to_user.username}`} visible={show} onOk={onOk} onCancel={() => setShow(false)}>
			<TextArea rows={4} value={content} onChange={e => setContent(e.target.value)} />
		</Modal>
	);
};
