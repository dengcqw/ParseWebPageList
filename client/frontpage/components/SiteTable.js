
import React from 'react'

import { Table, Icon, Modal, Button } from 'antd';
const { Column } = Table;

const { siteNames, categoryNames } =  require('../../../server/ParseWebPage/site.id.js')

const { fetchCategoryActionCreator } = require('../sagas/fetchCategory.js')
const { getAlbumsActionCreator } = require('../sagas/albums.js')

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
        siteID={siteID} />
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
        ["dianshiju", "zongyi", "dongman"].map((categoryID) => {
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
        })
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
  state = {
    visible: false,
    titleFromDetail: ''
  }

  static defaultProps = {
    hotItems: [],
    categoryID: '',
    siteID:'',
  };

  showDetail = function(item) {
    Modal.info({
      title: "详细信息",
      okText: "关闭",
      width: "500px",
      maskClosable: true,
      content: (
        <ItemDetailModal
          item={item}
          onRequsetDetail={
            ()=>fetch(`/api/itemDetail?title=${item.title}&category=${this.props.categoryID}&site=${this.props.siteID}`)
              .then(function(response) {
                if (response.status >= 400) {
                  throw new Error("Bad response from server");
                }
                return response.json();
              })
              .then((detail)=>{
                //debugger;
                if (detail && detail.albumDocInfo && detail.albumDocInfo.albumTitle) {
                  console.log('item title[', item.title, '] get albumTitle:', detail.albumDocInfo.albumTitle);
                  this.setState({titleFromDetail: detail.albumDocInfo.albumTitle});
                } else {
                  console.log('item title[', item.title, '] 获取失败');
                  this.setState({titleFromDetail: "获取失败"});
                }
              })
          }
          statusText={this.state.titleFromDetail} />
      ),
      onOk() {},
    });
  }

  render () {
    const { hotItems } = this.props
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
            //console.log("----> "+"table custom Column");
            //console.log("----> item "+JSON.stringify(item));
            //console.log("----> record"+JSON.stringify(reocrd));
            return (
              <span>
                <Button onClick={()=>this.showDetail(item)}>详情</Button>
              </span>
            )
          }}
        />
      </Table>
    );
  }
}

