
import React from 'react'

import { Table, Icon, Modal, Button } from 'antd';
const { Column } = Table;

const { siteNames, categoryNames } =  require('../../../server/ParseWebPage/site.id.js')

/*
 * hot table of each site
 */
export default class SiteTable extends React.Component {
  constructor (props) {
    super(props)
    this.today = new Date().toISOString().slice(0, 10)
  }

  static defaultProps = {
    siteContent: {},
    showTitle:true,
    siteID:"",  /* isRequired prop */
    date:''
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
              onClick={()=>fetchCategoryList()} >
              重新获取
            </Button>
          ) : null
        }
      </span>
    )
  }

  renderCategory(categoryID) {
    let hotItems = this.props.siteContent[categoryID];
    let siteID = this.props.siteID;
    return (
      <CategoryTable
        className='category-tb'
        hotItems={hotItems}
        categoryID={categoryID}
        siteID={siteID} />
    )
  }

  render () {
    const { siteContent, showTitle, siteID } = this.props;
    let categoryURL = ""
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

/*
          */


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
    const {hotItems} = this.props
    //if (hotItems.length && ! hotItems[0].key) {
      //hotItems.forEach(function(item, i) {
        //item.key = 'item' + i;
      //});
    //}
    let maphotItems = hotItems.map(item=>({'title':item}))
    return (
      <Table
      dataSource={maphotItems}
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

