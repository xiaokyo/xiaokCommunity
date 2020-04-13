import React, { useEffect, useState } from 'react'
import IconFont from '@components/iconFont'
import { formatDate } from '@common/formatDate';
import moment from 'moment'
// banks
import banks from './banks.json'

// style
import './style.less'

// banks
const getBanks = bankName => {
  return banks.find(_ => _.bankName === bankName) || { bankName: '未知', icon: 'icon-qiapian' }
}

export default ({ item, submitUpdate, delCard }) => {
  const { _id, platform, amount, remaining, dueDate, billingDate, account, accountName } = item
  console.log('banks', banks)
  const { bankName, icon } = getBanks(platform)

  const openMenus = () => {
    console.log('onTouchStart')
  }

  return (
    <div styleName="card" className="flex fdc" onClick={openMenus}>
      <div className="flex fdr aic jbc" style={{ marginBottom: 15 }}>
        <IconFont icon='icon-settings_light' onClick={() => submitUpdate(item)} />
        <IconFont icon='icon-guanbi1' onClick={() => delCard(_id)} />
      </div>
      <div className="flex fdr aic">
        <IconFont className="bankicon" icon={icon} />
        <div className='flex fdc' style={{ marginLeft: 15 }}>
          <div styleName="account">{account}</div>
          <div>{platform}({accountName})</div>
        </div>
      </div>
      <div className="flex fdr aic jbc" style={{ marginTop: 10 }}>
        <div>账单日<br />{moment(billingDate).format('MM-DD')}日</div>
        <div>还款日<br />{moment(dueDate).format('MM-DD')}日</div>
        <div>总额<br />{amount}</div>
        <div>剩余<br />{remaining}</div>
      </div>
    </div>
  )
}