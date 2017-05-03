
import ReactDOM from 'react-dom'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Layout, Menu, Breadcrumb, Icon, Button, Radio } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

import { HotListTabs } from './components/HotListTabs.js'
import { HotListTables } from './components/HotListTables.js'
const { siteIds, categoryNames } = require('../../server/ParseWebPage/site.id.js')

import { updateMenuActionCreator } from './sagas/menus.js'
import { getContentActionCreator } from './sagas/content.js'
import { getAlbumsActionCreator } from './sagas/albums.js'
import { fetchAllActionCreator } from './sagas/fetchAll.js'

import {
  updateDisplayTypeAction,
  updateSelectedTabAction,
  updateSelectedMenuAction
} from './reducers/uistate.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
    this.updateMenu = this.props.updateMenu
    this.fetchHotList = this.props.fetchAll
    this.changeDisplayType = this.changeDisplayType.bind(this)
  }

  componentWillMount () {
    this.updateMenu();
  }

  changeDisplayType(e) {
    console.log("----> switch to "+e.target.value)
    this.props.changeDisplayType(e.target.value)
  }

  menuClickAction = (item, key, keyPath) => {
    let menuName = this.props.menus[item.key]
    console.log("----> click menu: ", menuName)
    this.props.getContent(menuName)
    this.props.selectMenu(menuName)
  }

  render() {
    console.log("----> render")
    const { menus, isFetchingAll, displayType, content, selectTab, selectedMenu, selectedTab } = this.props;
    let menuKey = menus.indexOf(selectedMenu)
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
              defaultSelectedKeys={[menuKey]}
              selectedKeys={[menuKey]}
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
          <Layout style={{ padding: '0 24px 24px 24px' }}>
           <Radio.Group style={{margin:'20px'}} value={displayType} onChange={this.changeDisplayType}>
              <Radio.Button value="Tabs">选项卡</Radio.Button>
              <Radio.Button value="Tables">表格</Radio.Button>
            </Radio.Group>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
            {
              displayType == 'Tabs'
              ? <HotListTabs content={content} onSelect={selectTab}/>
              : <HotListTables content={content} onSelect={selectTab}/>
            }
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  let selectedMenu = state.uistate.selectedMenu
  let menus = state.menus
  if (selectedMenu == '' && menus.length) {
    selectedMenu = menus[0]
  }
  let content = state.content[selectedMenu] || {}
  return {
    isFetchingAll: state.uistate.fetchAllState,
    displayType: state.uistate.displayType,
    selectedTabs: state.uistate.selectedTabs,
    menus,
    selectedMenu,
    content,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    // async actions
    fetchAll: bindActionCreators(fetchAllActionCreator, dispatch),
    updateMenu: bindActionCreators(updateMenuActionCreator, dispatch),
    getContent: bindActionCreators(getContentActionCreator, dispatch),
    getAlbums: bindActionCreators(getAlbumsActionCreator, dispatch),
    // sync ui state actions
    changeDisplayType: bindActionCreators(updateDisplayTypeAction, dispatch),
    selectTab: bindActionCreators(updateSelectedTabAction, dispatch),
    selectMenu: bindActionCreators(updateSelectedMenuAction, dispatch),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
