
import ReactDOM from 'react-dom'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Layout, Menu, Breadcrumb, Icon, Button, Radio } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

import {HotListTables, HotListTabs} from './components/HotListComponents.js'
const { siteIds, categoryNames } = require('../../server/ParseWebPage/site.id.js')

import {updateMenuActionCreator} from './sagas/menus.js'
import {getContentActionCreator} from './sagas/content.js'
import {updateDisplayTypeAction} from './reducers/uistate.js'
import {getAlbumsActionCreator} from './sagas/albums.js'
import {fetchAllActionCreator} from './sagas/fetchAll.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content:{},
      loading: false,
      displayType:'Tabs',
      visible: false
    }
    this.updateMenu = this.props.updateMenu
    this.fetchHotList = this.props.fetchAll
    this.changeDisplayType = this.changeDisplayType.bind(this)
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

  changeDisplayType(e) {
    console.log("----> switch to "+e.target.value)
    this.props.changeDisplayType(e.target.value)
  }

  menuClickAction = (item, key, keyPath) => {
    this.menuKeys = [item.key];
    console.log("----> click menu key: ", item.key);
    this.props.getContent(this.props.menus[item.key]);
  }

  render() {
    const { content } = this.state;
    const { menus, isFetchingAll, displayType } = this.props;
    return (
      <Layout>
        <Header className="header">
          <Button type="primary" loading={isFetchingAll} onClick={this.fetchHotList}>
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
              <Radio.Button value="Tabs">选项卡</Radio.Button>
              <Radio.Button value="Tables">表格</Radio.Button>
            </Radio.Group>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
            {
              displayType == 'Tabs'
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
  isFetchingAll: state.uistate.fetchAllState,
  displayType: state.uistate.displayType,
  selectedTabs: state.uistate.selectedTabs,
  selectedMenu: state.uistate.selectedMenu,
  menus: state.menus,
})
const mapDispatchToProps = (dispatch) => {
  return {
    fetchAll: bindActionCreators(fetchAllActionCreator, dispatch),
    updateMenu: bindActionCreators(updateMenuActionCreator, dispatch),
    getContent: bindActionCreators(getContentActionCreator, dispatch),
    changeDisplayType: bindActionCreators(updateDisplayTypeAction, dispatch),
    getAlbums: bindActionCreators(getAlbumsActionCreator, dispatch),
    //tabChanged: bindActionCreators(todoActionCreators, dispatch),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
