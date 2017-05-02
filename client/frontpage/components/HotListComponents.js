
import ReactDOM from 'react-dom'
import React from 'react'

import { Table, Icon, Modal, Button, Tabs } from 'antd';
const { Column } = Table;

require('./hot_table.css');
const { siteIds, siteNames } =  require('../../../server/ParseWebPage/site.id.js')

/*
 * hot table list fo all site
 */
export class HotListTables extends React.Component {
  constructor (props) {
    super(props)
    // keep a binded function
    this._privateFunction = this.privateFunction.bind(this);
  }

  static defaultProps = {
    content: {}, // json file content
  };

  privateFunction () {
  }

  render () {
    return (
      <div>
      {
        Object.values(siteIds).map((siteID, i) => {
          let siteContent = this.props.content[siteID];
          return <SiteTable siteContent={siteContent} siteID={siteID}/>
        })
      }
      </div>
    )
  }
}

/*
 * show hot list as tabs
 */
export class HotListTabs extends React.Component {
  constructor (props) {
    super(props)
    // keep a binded function
    this._privateFunction = this.privateFunction.bind(this);
  }

  static defaultProps = {
    content: {}, // json file content
  };

  privateFunction () {
  }

  callback = (key) => {
    console.log("----> click: "+key)
  }

  render () {
    return (
      <Tabs onChange={this.callback} type="card" animated={false} defaultActiveKey="tabkey_0">
      {
        Object.values(siteIds).map((siteID, i) => {
          let siteContent = this.props.content[siteID];
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

const categoryName = {
"dianshiju":"电视剧",
"zongyi":"综艺",
"dongman":"动漫"
}

/*
 * hot table of each site
 */
class SiteTable extends React.Component {
  constructor (props) {
    super(props)
    this._privateFunction = this.privateFunction.bind(this);
  }

  static defaultProps = {
    siteContent: {},
    showTitle:true,
    siteID:"",  /* isRequired prop */
  };

  privateFunction () {
  }

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
              <span className='category-name' width='50px'>{categoryName[categoryID]}<a href={categoryURL} target='_blank'><Icon type="link" /></a></span>
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

export class ItemDetailModal extends React.Component {
  static defaultProps = {
    item: {},
    onRequsetDetail: function(){},
    statusText: ''
  };

  copyToClipboard = function(text) {
    if (window.clipboardData && window.clipboardData.setData) {
      // IE specific code path to prevent textarea being shown while dialog is visible.
      return clipboardData.setData("Text", text);

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      var textarea = document.createElement("textarea");
      textarea.textContent = text;
      textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
      document.body.appendChild(textarea);
      textarea.select();
      try {
        return document.execCommand("copy");  // Security exception may be thrown by some browsers.
      } catch (ex) {
        console.warn("Copy to clipboard failed.", ex);
        return false;
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }

  copyButton = (text)=> {
    return <Button size='small' style={{marginLeft:'20px'}} onClick={()=>this.copyToClipboard(text)}>copy</Button>;
  }
  requsetButton = ()=> {
    return <Button size='small' style={{marginLeft:'20px'}} onClick={this.props.onRequsetDetail}>requset</Button>;
  }

  render() {
    const {item, statusText} = this.props;
    if (item == undefined) {
      return null;
    }
    return (
      <div>
        <p style={{lineHeight: '20px'}}>视频名：{item.title}</p>
        <p style={{lineHeight: '20px'}}>网页链接：
          <a ref='pagelink' href={item.url} target="_blank">{item.url}</a>
          {this.copyButton(item.url)}
        </p>
        <p style={{lineHeight: '20px'}}>docID：{item.docID}
          {this.copyButton(item.docID)}
        </p>
        <p style={{lineHeight: '20px'}}>状态：{statusText}
          {this.requsetButton()}</p>
      </div>
    );
  }
}
