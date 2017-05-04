import React from 'react'

import SiteTable from './SiteTable.js'

const { siteIds } =  require('../../../server/ParseWebPage/site.id.js')

/*
 * hot table list fo all site
 */
export class HotListTables extends React.Component {
  constructor (props) {
    super(props)
  }

  static defaultProps = {
    content: {},
    date:''
  }

  render () {
    const { date, content } = this.props
    return (
      <div>
      {
        Object.values(siteIds).map((siteID, i) => {
          let siteContent = content[siteID];
          return <SiteTable siteContent={siteContent} siteID={siteID} date={this.props.date}/>
        })
      }
      </div>
    )
  }
}

