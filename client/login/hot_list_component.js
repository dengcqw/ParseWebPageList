
import ReactDOM from 'react-dom'
import React from 'react'

import { Table, Icon, Modal, Button, Tabs } from 'antd';
const { Column } = Table;

require('./hot_table.css');

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
    content: [], // json file content
  };

  privateFunction () {
  }

  render () {
    return (
      <div>
      {
        this.props.content.map(function(siteContent, i) {
          return <SiteTable siteContent={siteContent}/>
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
    content: [], // json file content
  };

  privateFunction () {
  }

  callback = (key) => {
    console.log(key);
  }

  render () {
    return (
      <Tabs onChange={this.callback} type="card" animated={false}>
      {
        this.props.content.map(function(siteContent, i) {
          return (
            <Tabs.TabPane tab={siteContent.siteID} key={"tabkey_"+i}>
              <SiteTable siteContent={siteContent} showTitle={false}/>
            </Tabs.TabPane>
          )
        })
      }
      </Tabs>
    )
  }
}

var categoryName = {
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
  };

  privateFunction () {
  }

  render () {
    const {siteContent, showTitle} = this.props;
    return (
      <div>
      {
        showTitle
        ? <div height="30px" className='site-name'>{siteContent.siteID}</div>
        : null
      }
      {
        ["dianshiju", "zongyi", "dongman"].map(function(categoryID) {
          if (!siteContent[categoryID]) {
            return null;
          }
          let hotItems = siteContent[categoryID].hotItems;
           return (
             <div style={{float:"left", marginRight:'40px'}}>
               <span className='category-name' width='50px'>{categoryName[categoryID]}</span>
               <CategoryTable className='category-tb' hotItems={hotItems}/>
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
 * data example
[{
  title: 'John',
  url: 'Brown',
  action:function(action){}
}]

*/
class CategoryTable extends React.Component {
  state = { visible: false }

  showModal = () => {
    this.setState({
      visible: true,
      detailItem: undefined
    });
  }

  static defaultProps = {
    hotItems: [],
  };

  showDetail = function(item) {
    Modal.info({
      title: "详细信息",
      okText: "关闭",
      width: "500px",
      maskClosable: true,
      content: (
        <ItemDetailModal item={item}/>
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

  button = (text)=> {
    return <Button size='small' style={{marginLeft:'20px'}} onClick={()=>this.copyToClipboard(text)}>copy</Button>;
  }

  render() {
    const {item} = this.props;
    if (item == undefined) {
      return null;
    }
    return (
      <div>
        <p style={{lineHeight: '20px'}}>视频名：{item.title}</p>
        <p style={{lineHeight: '20px'}}>网页链接：
          <a ref='pagelink' href={item.url} target="_blank">{item.url}</a>
          {this.button(item.url)}
        </p>
        <p style={{lineHeight: '20px'}}>docID：{item.docID}
          {this.button(item.docID)}
        </p>
        <p style={{lineHeight: '20px'}}>状态：TODO</p>
      </div>
    );
  }
}
