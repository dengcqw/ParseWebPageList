
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
  }

  callback = (key) => {
    console.log("----> click: "+key)
  }

  render () {
    return (
      <Tabs onChange={this.callback} type="card" animated={false} defaultActiveKey="tabkey_0">
      {
        Object.values(siteIds).map((siteID, i) => {
          let siteContent = this.props.content[siteID]
          return (
            <Tabs.TabPane tab={siteNames[siteID]} key={"tabkey_"+i}>
              <SiteTable siteContent={siteContent} showTitle={false} siteID={siteID}/>
            </Tabs.TabPane>
          )
        })
      }
      </Tabs>
    )
  }
}

