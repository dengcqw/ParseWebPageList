
require('../common/reset.css');
require('antd/dist/antd.css');
import ReactDOM from 'react-dom'
import React from 'react'

import { DatePicker } from 'antd';

require('es6-promise').polyfill();
require('isomorphic-fetch');

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      result: "test"
    }
    this._privateFunction.bind(this)();
    this.handleClick = this.handleClick.bind(this);
  }

  _privateFunction () {
    fetch('//offline-news-api.herokuapp.com/stories')
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then((resjson) => {
        this.setState({result: resjson[0].body});
        this.refs.fetch.innerHTML = resjson[0].body;
      });
  }

  handleClick (event) {
    alert("somethingclick", (event));
  }

  render () {
    return (
      <div style={{flex:1, width:"500px"}}>
        <DatePicker/>
        <div style={{color:"red"}} ref='fetch'></div>
        <div style={{height: "20px"}}/>
        <div>
          {this.state.result}
        </div>
        <input type="button" value="Focus the text input" onClick={this.handleClick} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
