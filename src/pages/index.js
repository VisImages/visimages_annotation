import React from 'react';
import {
  Layout, Modal, Avatar, Icon, Button
} from 'antd';
import MainContent from '../components/MainContent';
import * as fetcher from '../global/fetcher';
import userAvatar from '../static/logo.png';
import sysLogo from '../static/logo.png';
import '../css/index.less';

const { Header, Footer } = Layout;

class Index extends React.Component {
  constructor(props) {
    super(props);
    console.log(fetcher.getTaskNum())
    this.state = {
      username: fetcher.getUsername(),
      visible: false,
      confirmLoading: false,
    };
  }

    showModal = () => {
      this.setState({
        visible: true,
      });
    };

    handleOk = () => {
      this.setState({
        ModalText: 'The modal will be closed after two seconds',
        confirmLoading: true,
      });
      setTimeout(() => {
        this.setState({
          visible: false,
          confirmLoading: false,
        });
      }, 2000);
    };

    handleCancel = () => {
      this.setState({
        visible: false,
      });
    };

    logOut() {
      fetcher.logout();
      this.setState({ username: fetcher.getUsername() });
    }
    getTasksPool = async () => {
      let res = await fetcher.postWithTokenPro('/all_tasks');
      console.log(res)
    }

    render() {
      const { visible, confirmLoading, ModalText } = this.state;
      return (
        <Layout>
          <Header className="index-header">
            <img className="sys-logo" src={sysLogo} alt="sys logo" />
            <h1>VisImages Annotator</h1>
            <div className="right-item">
              {['ddz','dengdazhen','xumengye','wuyihong','discussion'].includes(fetcher.getUsername()) ? 
                (<Button type="primary" shape="round" onClick={this.getTasksPool}>任务池</Button>) : ''
              }
              <Avatar style={{marginLeft: '20px'}} size="large" src={userAvatar} />
              <span className="sys-username" >{this.state.username}</span>
              <Icon title="logout" onClick={this.logOut.bind(this)} className="sys-logout" type="logout" />
            </div>
          </Header>
          <MainContent username={this.state.username} />
          <Footer style={{ paddingTop:'10px',paddingBottom:'10px',textAlign: 'center', zIndex: '998', width: '100%' }}>Annotator ©2020 Created by VisImages</Footer>
          <Modal
            title="Title"
            visible={visible}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
          >
            <p>{ModalText}</p>
          </Modal>
        </Layout>
      );
    }
}

export default Index;
