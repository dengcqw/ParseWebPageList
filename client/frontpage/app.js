
import ReactDOM from 'react-dom'
import React from 'react'
import { connect, bindActionCreators } from 'react-redux'

import { Layout, Menu, Breadcrumb, Icon, Button, Radio } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

import {HotListTables, HotListTabs} from './components/HotListComponents.js'
const { siteIds, categoryNames } = require('../../server/ParseWebPage/site.id.js')

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: [],
      content:{},
      loading: false,
      displayType:'tabs',
      visible: false
    }
    this.updateMenu = this.updateMenu.bind(this);
    this.getHotList = this.getHotList.bind(this);
    this.fetchHotList = this.fetchHotList.bind(this);
    this.changeDisplayType = this.changeDisplayType.bind(this);
    this.menuKeys = ['0'];
    this.contentCache = {};
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
    fetch('/api/captureInfo')
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then((dates) => {
        if (dates && dates.length > 0) {
          this.getHotList(dates[this.menuKeys[0]]);
          this.setState({menus: dates});
        } else {
          this.setState({menus: []});
        }
      });
  }

  // read list from database
  getHotList(dateString) {
    if (!dateString ) throw new Error('fileName is undefined, can not get file content');
    if (this.contentCache[dateString]) {
      console.log("----> "+"get content cache: " + dateString);
      this.setState({content: this.contentCache[dateString]});
      return;
    }

    fetch('/api/getHotList?date='+dateString)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then((content) => {
        debugger;
        console.log("----> ", content)
        let urlids = []
        Object.keys(categoryNames).forEach(categoryID => {
          Object.values(siteIds).forEach(siteID => {
            if (content[siteID] && content[siteID][categoryID]) {
              urlids = urlids.concat(content[siteID][categoryID])
            }
          })
        })
        this.getAlbums(urlids)
        this.setState({content});
        if (Object.keys(content).length) {
          this.contentCache[dateString] = content;
        }
      });
  }

  getAlbums(urlIds) {
    //if (urlIds instanceOf Array)
    //if (!urlIds instanceOf String) throw new Error('getAlbums urlIds should be array or string')
    fetch('/api/getAlbums', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(urlIds)
    }).then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    }).then((content) => {
        debugger;
        console.log("----> ", content)
      });
  }

  // fetch new list from website
  fetchHotList() {
    this.setState({loading: true});
    //setTimeout(()=>{this.setState({loading: false})}, 1000 * 60);
    fetch('/api/fetchAll')
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.text();
      })
      .then((content) => {
        debugger;
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
    this.getHotList(this.state.menus[item.key]);
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

const mapStateToProps = (state) => ({
  isFetching: state.isFetching,
  displayType: state.displayType,
  menus: state.menus,
  tab: state.tab,
})
const mapDispatchToProps = (dispatch) => {
  return {
    //fetchAll: bindActionCreators(todoActionCreators, dispatch),
    //fetchMenu: bindActionCreators(todoActionCreators, dispatch),
    //fetchContent: bindActionCreators(todoActionCreators, dispatch),
    //changeDisplayType: bindActionCreators(todoActionCreators, dispatch),
    //tabChanged: bindActionCreators(todoActionCreators, dispatch),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
