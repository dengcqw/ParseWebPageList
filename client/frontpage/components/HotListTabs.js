
import React from 'react'
import { Tabs } from 'antd';

import SiteTable from './SiteTable.js'

const { siteIds, siteNames } =  require('../../../server/ParseWebPage/site.id.js')

/*
 * show hot list as tabs
 */
export class HotListTabs extends React.Component {
  constructor (props) {
    super(props)
  }

  static defaultProps = {
    content: {}, // json file content
    date:''
  }

  callback = (key) => {
    console.log("----> click Tab: "+ key)
    this.props.onSelect(key)
  }

  render () {
    const { selectedTab, date } = this.props
    return (
      <Tabs onChange={this.callback}
      activeKey={selectedTab}
      type="card" animated={false} defaultActiveKey="iqiyi">
      {
        Object.values(siteIds).map((siteID, i) => {
          let siteContent = this.props.content[siteID]
          return (
            <Tabs.TabPane tab={siteNames[siteID]} key={siteID}>
              <SiteTable siteContent={siteContent} showTitle={false} siteID={siteID} date={date} />
            </Tabs.TabPane>
          )
        })
      }
      </Tabs>
    )
  }
}

