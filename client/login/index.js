
import ReactDOM from 'react-dom'
import React from 'react'

import { Layout, Menu, Breadcrumb, Icon, Button} from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

require('es6-promise').polyfill();
require('isomorphic-fetch');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: [],
      content:"",
      loading: false,
    }
    this.updateMenu = this.updateMenu.bind(this);
    this.getFileContent = this.getFileContent.bind(this);
    this.fetchHotList = this.fetchHotList.bind(this);
    this.menuKeys = ['0'];
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
        this.setState({menus: resjson});
      });
  }

  getFileContent(item, key, keyPath) {
    this.menuKeys = [key];
    console.log("----> "+key); // it is undefined
    fetch('/api/getContent?filename='+this.state.menus[item.key])
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.text();
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

  render() {
    const { menus, content} = this.state;
    let menuClickAction = this.getFileContent;
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
              onClick={menuClickAction}
              selectedKeys={this.menuKeys}
            >
              <SubMenu key="sub1" title={<span><Icon type="user" />榜单数据</span>}>
              {
                menus.map(function(name, i){
                  return <Menu.Item key={i}>{name}</Menu.Item>
                })
              }
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '24px' }}>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              {content}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
