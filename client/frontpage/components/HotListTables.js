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
    content: {}, // json file content
    date:''
  };

  render () {
    return (
      <div>
      {
        Object.values(siteIds).map((siteID, i) => {
          let content = this.props.content[siteID];
          return <SiteTable content={content} siteID={siteID} date={this.props.date}/>
        })
      }
      </div>
    )
  }
}

