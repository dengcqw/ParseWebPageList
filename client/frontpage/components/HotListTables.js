import React from 'react'

import SiteTable from './SiteTable.js'

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
        Object.entries(content).map(([siteID, siteContent]) => {
          return <SiteTable siteContent={siteContent} siteID={siteID} date={this.props.date}/>
        })
      }
      </div>
    )
  }
}

