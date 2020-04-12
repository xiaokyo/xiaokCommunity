import { graphql } from '@graphql';


const saveCard = data => ({ type: 'SAVE_CREDITCARD', data });

// 获取卡片列表
export const queryCards = () => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			//请求postbyid
			const args = `
				query{
					creditCards{
						_id
						platform
						amount
						remaining
						dueDate
						billingDate
						account
						accountName
					}
				}
			`;

			const [err, res] = await graphql({ args });
			if (err) return reject(err);
			dispatch(saveCard(res.creditCards));
			return resolve();
		});
};

// add卡片
export const addCard = ({ variables }) => {
	return () =>
		new Promise(async (resolve, reject) => {
			//请求postbyid
			const args = `
				addCard($platform:String,$amount:String,$remaining:String,$dueDate:String,$account:String,$billingDate:String,$accountName:String){
					addCard(platform:$platform,amount:$amount,remaining:$remaining,dueDate:$dueDate,account:$account,billingDate:$billingDate,accountName:$accountName){
						success
						msg
					}
				}
			`;

			const [err, res] = await graphql({ type: 'mutation', args, variables });
			if (err) return reject(err);
			// dispatch(saveCard(res.addCard));
			return resolve(res.addCard);
		});
}

// update卡片
export const updateCard = ({ variables }) => {
	return () =>
		new Promise(async (resolve, reject) => {
			//请求postbyid
			const args = `
				updateCard($_id:String!,$platform:String,$amount:String,$remaining:String,$dueDate:String,$account:String,$billingDate:String,$accountName:String){
					updateCard(_id:$_id,platform:$platform,amount:$amount,remaining:$remaining,dueDate:$dueDate,account:$account,billingDate:$billingDate,accountName:$accountName){
						success
						msg
					}
				}
			`;

			const [err, res] = await graphql({ type: 'mutation', args, variables });
			if (err) return reject(err);
			// dispatch(saveCard(res.addCard));
			return resolve(res.updateCard);
		});
}

// deleteCard
export const deleteCard = ({ _id }) => {
	return () =>
		new Promise(async (resolve, reject) => {
			//请求postbyid
			const args = `
				deleteCard($_id:String!){
					deleteCard(_id:$_id){
						success
						msg
					}
				}
			`;

			const [err, res] = await graphql({ type: 'mutation', args, variables: { _id } });
			if (err) return reject(err);
			// dispatch(saveCard(res.addCard));
			return resolve(res.deleteCard);
		});
}