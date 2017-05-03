
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
  }

  static defaultProps = {
    siteContent: {},
    showTitle:true,
    siteID:"",  /* isRequired prop */
  };

  render () {
    const {siteContent, showTitle, siteID} = this.props;
    return (
      <div>
      {
        showTitle
        ? <div height="30px" className='site-name'>{siteNames[siteID]}</div>
        : null
      }
      {
        (siteContent && siteContent.siteID/* valid content should has its siteID */)
        ? (["dianshiju", "zongyi", "dongman"].map(function(categoryID) {
          if (!siteContent[categoryID]) {
            return null;
          }
          let hotItems = siteContent[categoryID].hotItems;
          let categoryURL = siteContent[categoryID].url;
          let contentSiteID = siteContent.siteID;
          return (
            <div style={{float:"left", marginRight:'40px'}}>
              <span className='category-name' width='50px'>{categoryNames[categoryID]}<a href={categoryURL} target='_blank'><Icon type="link" /></a></span>
              <CategoryTable
                className='category-tb'
                hotItems={hotItems}
                categoryID={categoryID}
                siteID={contentSiteID} />
            </div>
          )
        }))
        : <p style={{color:'red'}}>{siteNames[siteID]}数据为空</p>
      }
        <div className='clear'></div>
      </div>
    )
  }
}

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
    const {hotItems} = this.props;
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

