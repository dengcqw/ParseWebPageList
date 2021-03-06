
import React from 'react'

import { Table, Icon, Modal, Button } from 'antd';
const { Column } = Table;

import categoryNames from '../categoryNames.js'
const { siteNames } = require('../siteNames.js')

const { fetchCategoryActionCreator } = require('../sagas/fetchCategory.js')
const { getAlbumsActionCreator } = require('../sagas/albums.js')

import ItemDetailModal from './ItemDetailModal.js'
import Form from './Form.js'

import { connect } from 'react-redux'

/*
 * hot table of each site
 */
class SiteTable extends React.Component {
  constructor (props) {
    super(props)
    this.today = new Date().toISOString().slice(0, 10)
    /* Tabs first create when click need update albums*/
    this.updateAlbums(this.props)
  }

  static defaultProps = {
    siteContent: {},
    showTitle:true,
    siteID:"",
    date:''
  }

  refetchButtonClicked = (siteID, categoryID)=> {
    console.log("----> fetch category")
    this.props.dispatch(fetchCategoryActionCreator({siteID, categoryID}))
  }

  updateAlbums = (props) => {
    const { albums, siteContent } = props
    let emptyAlbumURLIds = Object.values(siteContent).reduce((reduced, urlIds) => {
      urlIds = urlIds || []
      let filtered = urlIds.filter(urlID => !albums[urlID])
      return reduced.concat(filtered)
    }, [])
    console.log("----> get ablums: ", props.siteID, emptyAlbumURLIds)
    if (emptyAlbumURLIds.length) {
      this.props.dispatch(getAlbumsActionCreator(emptyAlbumURLIds))
    }
  }

  showDetail = (siteID, categoryID) => item => {
    console.log("----> show detail: ", siteID, categoryID, item)
    Modal.info({
      title: "详细信息",
      okText: "关闭",
      width: "80%",
      maskClosable: true,
      content: (
        //<Form/>
        <ItemDetailModal item={item} categoryID={categoryID} siteID={siteID} />
      ),
      onOk() {},
    });
  }

  componentWillReceiveProps (nextProps) {
    console.log("----> SiteTable", nextProps.siteID, "WillReceiveProps: selected ", nextProps.selected)
    if (nextProps.selected) {
      this.updateAlbums(nextProps)
    }
  }

  renderCategoryTitle(categoryID) {
    let siteID = this.props.siteID
    let categoryURL = `/api/redirectHotPage?categoryid=${categoryID}&siteid=${siteID}`
    return (
      <span
        className='category-name'
        width='50px' >
        {categoryNames[categoryID]}
        <a href={categoryURL} target='_blank'><Icon type="link"/></a>
        {
          this.today == this.props.date
          ? (
            <Button
              size='small'
              style={{marginLeft:'20px'}}
              onClick={() => this.refetchButtonClicked(siteID, categoryID)} >
              重新获取
            </Button>
          ) : null
        }
      </span>
    )
  }

  renderCategory(categoryID) {
    let urlIds = this.props.siteContent[categoryID] || []
    let hotItems = urlIds.map(urlID => (this.props.albums[urlID] || {title: 'loading'}))
    let siteID = this.props.siteID;
    return (
      <CategoryTable
        className='category-tb'
        hotItems={hotItems || []}
        categoryID={categoryID}
        siteID={siteID}
        showDetail={this.showDetail(siteID, categoryID).bind(this)} />
    )
  }

  render () {
    const { siteContent, showTitle, siteID } = this.props;
    return (
      <div>
      {
        showTitle
        ? <div height="30px" className='site-name'>{siteNames[siteID]}</div>
        : null
      }
      {
        Object.keys(siteContent).length
        ? Object.keys(siteContent).map((categoryID) => {
          return (
            <div style={{float:"left", marginRight:'40px'}}>
              {
                this.renderCategoryTitle(categoryID)
              }
              {
                this.renderCategory(categoryID)
              }
            </div>
          )
        }) : <p>数据表为空</p>
      }
        <div className='clear'></div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  ...props,
  albums: state.albums
})
export default connect(mapStateToProps)(SiteTable)

/*
 * data example
[{
  title: 'John',
  url: 'Brown',
  action:function(action){}
}]

*/
class CategoryTable extends React.Component {
  static defaultProps = {
    hotItems: [],
    categoryID: '',
    siteID:'',
  }

  render () {
    const { hotItems, showDetail } = this.props
    if (hotItems.length && ! hotItems[0].key) {
      hotItems.forEach(function(item, i) {
        item.key = 'item' + i;
      });
    }
    return (
      <Table
      dataSource={hotItems}
      pagination={false}
      size='small'
      >
        <Column
          title="视频名"
          dataIndex="title"
          key="title"
        />
        <Column
          title="操作"
          key="action"
          render={(item) => {
            return (
              <span>
                <Button onClick={()=>showDetail(item)}>详情</Button>
              </span>
            )
          }}
        />
      </Table>
    );
  }
}

