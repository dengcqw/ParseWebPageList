import React from 'react'

import { Button } from 'antd';

import Api from '../services'

export default class ItemDetailModal extends React.Component {
  static defaultProps = {
    item: {},
    categoryID: '',
    siteID: '',
  }

  titleRef = 'title'

  state = {
    detail: {},
    editValue: {},
    statusText: ''
  }

  _mergeDetail = (item, detail) => {
    let albumDocInfo = detail.albumDocInfo || {}
    return {
      docid : item.docid || detail.doc_id,
      imgh : item.imgh || albumDocInfo.albumHImage,
      imgv : item.imgv || albumDocInfo.albumVImage,
      desc : item.desc || albumDocInfo.description,
      capturedurl : item.capturedurl,
      urlid : item.urlid,
      title: item.title,
    }
  }

  handleTextChange = (ref) => (event) => {
    this.setState({editValue: {[ref] : event.target.value}})
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
    let title = this.state.editValue[this.titleRef] || item.title

    fetch(`/api/itemDetail?title=${title}&categoryid=${categoryID}&siteid=${siteID}`)
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
          this.setState({detail, displaySaveButton: true, statusText:'requset success'})
        } else {
          console.log('item title[', item.title, '] 获取失败');
          this.setState({detail: null, displaySaveButton: false, statusText:'requset fail'});
        }
      })
  }

  onSave = () => {
    let mergeDetailItem = this._mergeDetail(this.props.item, this.state.detail)
    let mergeEditValueItem = Object.assign({}, mergeDetailItem , this.state.editValue)
    Api.saveDetail(mergeEditValueItem).then(() => {
      this.setState({statusText: 'save success'})
    }).catch(err => this.setState({statusText: 'save success'}))
  }

  renderEditText = (text, ref) => {
    return (
      <input
        type="text"
        style={{width: '400px'}}
        value={this.state.editValue[ref] || text}
        onChange={this.handleTextChange(ref).bind(this)}
      />
    )
  }

  copyButton = (text)=> {
    return <Button size='small' style={{marginLeft:'20px'}} onClick={()=>this.copyToClipboard(text)}>copy</Button>;
  }
  requsetButton = ()=> {
    return <Button size='small' style={{marginLeft:'20px'}} onClick={this.onRequsetDetail}>requset</Button>;
  }
  saveButton = ()=> {
    let display = this.state.displaySaveButton ? 'inline-block' : 'none'
    return <Button size='small' style={{marginLeft:'20px', display}} onClick={this.onSave}>save</Button>;
  }

  render() {
    console.log("----> render item detail")
    const { item } = this.props
    if (item == undefined) {
      return null
    }
    const { detail, statusText } = this.state

    let newItem = this._mergeDetail(item, detail)
    let url = newItem.capturedurl
    let docid = newItem.docid
    let urlid = newItem.urlid
    let imgh = newItem.imgh
    let imgv = newItem.imgv
    let desc = newItem.desc
    let title = newItem.title

    return (
      <div>
        <p style={{lineHeight: '20px'}}>
          视频：{this.renderEditText(title, this.titleRef)}
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
          状态：{statusText} {this.requsetButton()} {this.saveButton()}
        </div>
      </div>
    );
  }
}
