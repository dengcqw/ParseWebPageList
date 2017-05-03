import React from 'react'

import { Button } from 'antd';

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
