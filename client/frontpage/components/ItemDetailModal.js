import React from 'react'

import { Button } from 'antd';

export default class ItemDetailModal extends React.Component {
  static defaultProps = {
    item: {},
    categoryID: '',
    siteID: '',
  }

  state = {
    detail: {},
  }

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

  onRequsetDetail = () => {
    const {item, categoryID, siteID } = this.props

    fetch(`/api/itemDetail?title=${item.title}&categoryid=${categoryID}&siteid=${siteID}`)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then((detail)=>{
        //debugger;
        console.log("----> ", detail)
        if (detail && detail.albumDocInfo && detail.albumDocInfo.albumTitle) {
          console.log('item title[', item.title, '] get albumTitle:', detail.albumDocInfo.albumTitle)
          this.setState({detail})
        } else {
          console.log('item title[', item.title, '] 获取失败');
          this.setState({detail: null});
        }
      })
  }

  copyButton = (text)=> {
    return <Button size='small' style={{marginLeft:'20px'}} onClick={()=>this.copyToClipboard(text)}>copy</Button>;
  }
  requsetButton = ()=> {
    return <Button size='small' style={{marginLeft:'20px'}} onClick={this.onRequsetDetail}>requset</Button>;
  }

  render() {
    console.log("----> render item detail")
    const { item } = this.props
    const { detail } = this.state
    let albumDocInfo = detail.albumDocInfo || {}
    if (item == undefined) {
      return null;
    }
    let url = item.capturedurl
    let docid = item.docid || detail.doc_id
    let urlid = item.urlid
    let imgh = item.imgh || albumDocInfo.albumHImage
    let imgv = item.imgv || albumDocInfo.albumVImage
    let desc = item.desc || albumDocInfo.description

    let statusText = detail? 'success' : 'fail'

    return (
      <div>
        <p style={{lineHeight: '20px'}}>
          视频：{item.title}
        </p>
        <div style={{lineHeight: '20px'}}>
          docID：{docid} {this.copyButton(docid)}
        </div>
        <div style={{lineHeight: '20px'}}>
          urlID：{urlid} {this.copyButton(urlid)}
        </div>
        <p style={{lineHeight: '20px'}}>
          网页： <a ref='pagelink' href={url} target="_blank">{url}</a>
        </p>
        <p style={{lineHeight: '20px'}}>
          描述：{desc}
        </p>
        <div style={{lineHeight: '80px'}}>
          竖图： <a ref='pagelink' href={imgv} target="_blank"><img className='detail-img' src={imgv}></img></a>
          横图： <a ref='pagelink' href={imgh} target="_blank"><img className='detail-img' src={imgh}></img></a>
        </div>
        <div style={{lineHeight: '20px'}}>
          状态：{statusText} {this.requsetButton()}
        </div>
      </div>
    );
  }
}
