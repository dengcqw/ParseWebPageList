
import ReactDOM from 'react-dom'
import React from 'react'

import { Layout, Menu, Breadcrumb, Icon, Button, Radio } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

require('es6-promise').polyfill();
require('isomorphic-fetch');

import {HotListTables, HotListTabs, ItemDetailModal} from './hot_list_component.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: [],
      content:[],
      loading: false,
      displayType:'tabs',
      visible: false
    }
    this.updateMenu = this.updateMenu.bind(this);
    this.getFileContent = this.getFileContent.bind(this);
    this.fetchHotList = this.fetchHotList.bind(this);
    this.changeDisplayType = this.changeDisplayType.bind(this);
    this.menuKeys = ['0'];
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  componentWillMount () {
    this.updateMenu();
  }

  updateMenu() {
    fetch('/api/getFilenames')
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then((resjson) => {
        this.getFileContent(resjson[this.menuKeys[0]]);
        this.setState({menus: resjson});
      });
  }

  getFileContent(fileName) {
    if (!fileName ) throw new Error('fileName is undefined, can nott get file content');
    fetch('/api/getContent?filename='+fileName)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then((content) => {
        this.setState({content});
      });
  }

  fetchHotList() {
    this.setState({loading: true});
    //setTimeout(()=>{this.setState({loading: false})}, 1000 * 60);
    fetch('/api/fetchHotList')
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.text();
      })
      .then((content) => {
        this.menuKeys =['0'];
        this.updateMenu();
        this.setState({content, loading: false});
      });
  }

  changeDisplayType(e) {
    console.log("----> switch to "+e.target.value);
    this.setState({displayType: e.target.value});
  }

  menuClickAction = (item, key, keyPath) => {
    this.menuKeys = [item.key];
    console.log("----> key: "+item.key);
    this.getFileContent(this.state.menus[item.key]);
  }

  render() {
    const { menus, content, displayType} = this.state;
    return (
      <Layout>
        <Header className="header">
          <Button type="primary" loading={this.state.loading} onClick={this.fetchHotList}>
            爬取榜单
          </Button>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
              onClick={this.menuClickAction}
              defaultSelectedKeys={this.menuKeys}
              selectedKeys={this.menuKeys}
            >
              <SubMenu key="sub1" title={<span><Icon type="user" />榜单数据</span>}>
              {
                menus.map(function(name, i){
                  return <Menu.Item key={''+i}>{name}</Menu.Item>
                })
              }
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px 24px' }}>
           <Radio.Group style={{margin:'20px'}} value={displayType} onChange={this.changeDisplayType}>
              <Radio.Button value="tabs">选项卡</Radio.Button>
              <Radio.Button value="tables">表格</Radio.Button>
            </Radio.Group>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
            {
              displayType == 'tabs'
              ? <HotListTabs content={content}/>
              : <HotListTables content={content}/>
            }
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
