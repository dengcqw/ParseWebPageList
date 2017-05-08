
import React from 'react'
import { Tabs } from 'antd';

import SiteTable from './SiteTable.js'

const { siteNames } = require('../siteNames.js')

/*
 * show hot list as tabs
 */
export class HotListTabs extends React.Component {
  constructor (props) {
    super(props)
  }

  static defaultProps = {
    content: {},
    date:''
  }

  callback = (key) => {
    console.log("----> click Tab: "+ key)
    this.props.onSelect(key)
  }

  render () {
    const { selectedTab, date, content } = this.props
    return (
      <Tabs onChange={this.callback}
      activeKey={selectedTab}
      type="card" animated={false} defaultActiveKey="iqiyi">
      {
        Object.entries(content).map(([siteID, siteContent]) => {
          return (
            <Tabs.TabPane tab={siteNames[siteID]} key={siteID}>
              <SiteTable
                siteContent={siteContent}
                showTitle={false}
                siteID={siteID}
                date={date}
                selected={selectedTab == siteID} />
            </Tabs.TabPane>
          )
        })
      }
      </Tabs>
    )
  }
}

