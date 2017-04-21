
import ReactDOM from 'react-dom'
import React from 'react'

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

require('es6-promise').polyfill();
require('isomorphic-fetch');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: []
    }
    this.updateMenu = this.updateMenu.bind(this);
  }

  componentWillMount () {
    this.updateMenu();
  }

  updateMenu() {
    fetch('/api/count.json')
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


  render() {
    const { menus } = this.state;
    return (
      <Layout>
        <Header className="header">
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
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
              Content
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
