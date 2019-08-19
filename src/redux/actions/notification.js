import { graphql } from '@graphql';

export const newNotification = data => {
	return dispatch =>
		dispatch({
			type: 'NEW_NOTIFICATION',
			data,
		});
};

export const initNotification = data => {
	return dispatch =>
		dispatch({
			type: 'INIT_NOTIFICATION',
			data,
		});
};

export const clearNotification = () => {
	return dispatch =>
		new Promise(async (resolve, reject) => {
			const args = `{
					clearNotification{
						success
						msg
					}
				}`;
			const [err, res] = await graphql({ args });
			if (err) return reject(err);
			dispatch({ type: 'CLEAR_NOTIFICATION' });
			resolve();
		});
};
