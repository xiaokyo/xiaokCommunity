import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// banks
import banks from './components/card/banks.json'
import {
	Button, Modal, Form,
	Input,
	Radio,
	Select,
	Cascader,
	DatePicker,
	InputNumber,
	TreeSelect,
	Switch,
	message,
} from 'antd'

// components
import Card from './components/card'

//style
import './style.less';

// actions
import { queryCards, addCard, updateCard, deleteCard } from '@redux/actions/creditCards'

export default props => {

	const [form] = Form.useForm()

	const creditCards = useSelector(state => state.creditCards)
	const dispatch = useDispatch()
	const { visible, currentItem, setVisible, onSubmit, onFinishFailed, submitAdd, submitUpdate, delCard } = useCustomForm({ form, queryCards, dispatch })

	useEffect(() => {
		queryCards()(dispatch)
	}, [])

	return (
		<>
			<Button type="primary" onClick={() => submitAdd()} style={{ margin: '15px' }}>添加卡片</Button>
			<Modal
				title="添加卡片"
				visible={visible}
				destroyOnClose
				// onOk={onSubmit}
				onCancel={() => setVisible(false)}
				footer={null}
			>
				<Form
					form={form}
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 14 }}
					layout="horizontal"
					onFinish={onSubmit}
					onFinishFailed={onFinishFailed}
				// initialValues={{ ...currentItem }}
				// onValuesChange={onFormLayoutChange}
				// size={componentSize}
				>

					<Form.Item label="平台" name="platform">
						<Select allowClear style={{ width: '100%', maxWidth: '100%' }} placeholder="Please select">
							{banks.map(_ => <Select.Option value={_.bankName}>{_.bankName}</Select.Option>)}
						</Select>
					</Form.Item>

					<Form.Item label="账号名称" name="accountName">
						<Input />
					</Form.Item>

					<Form.Item label="银行账号" name="account">
						<Input />
					</Form.Item>

					<Form.Item label="总额度" name="amount">
						<Input />
					</Form.Item>

					<Form.Item label="剩余额度" name="remaining">
						<Input />
					</Form.Item>

					<Form.Item label="还款日期" name="dueDate">
						<Input />
					</Form.Item>

					<Form.Item label="账单日" name="billingDate">
						<Input />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit">提交</Button>
					</Form.Item>
				</Form>
			</Modal>


			<div styleName="creditCards">
				{creditCards && creditCards.map(item => <Card key={item._id} {...{ item, submitUpdate, delCard }} />)}
			</div>
		</>
	);
};



const useCustomForm = ({ form, queryCards, dispatch }) => {

	const [visible, setVisible] = useState(false)
	const [currentItem, setCurrentItem] = useState(undefined)
	const { setFieldsValue, resetFields } = form


	// 提交的时候
	const onSubmit = async (values) => {
		console.log('submit', values)
		let fun = addCard
		let params = { ...values }
		if (currentItem) {
			fun = updateCard
			params._id = currentItem._id
		}

		const res = await fun({ variables: params })()
		if (!res.success) return message.error(res.msg || '服务器错误')
		message.success(res.msg || '操作成功')

		queryCards()(dispatch)
	}

	// 删除
	const delCard = async (_id) => {
		const flag = confirm('确定要删除吗？')
		if (!flag) return
		const res = await deleteCard({ _id })()
		if (!res.success) return message.error(res.msg || '服务器错误')
		message.success(res.msg || '操作成功')

		queryCards()(dispatch)
	}

	// add 
	const submitAdd = () => {
		setCurrentItem(undefined)
		resetFields()
		setVisible(true)
	}

	// update
	const submitUpdate = (item) => {
		setCurrentItem(item)
		setFieldsValue(item)
		setVisible(true)
	}

	const onFinishFailed = (errorInfo) => {
		console.log('error', errorInfo)
	}

	return { visible, currentItem, setVisible, submitAdd, submitUpdate, onSubmit, onFinishFailed, delCard }
}