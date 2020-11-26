import React from 'react';
import { Layout, message, Modal } from 'antd';
import '../css/MainContent.less';
import PicPresenter from './PicPresenter';
import AnnSelector from './AnnSelector';
import PicList from './PicList';
import * as fetcher from '../global/fetcher';
var firstKey = null
var secondKey = null

const requireContext = require.context('../static/categories', true, /^\.\/.*\.png$/);
const annotations = {};
requireContext.keys().forEach((key) => {
  let a = key.split('/')[1];
  a = a.split('.')[1]
  const b = key.split('/')[2];
  if (annotations.hasOwnProperty(a)) {
    if (!annotations[a].hasOwnProperty(b)) annotations[a][b] = [requireContext(key)];
    else annotations[a][b].push(requireContext(key));
  } else {
    annotations[a] = {};
    annotations[a][b] = [requireContext(key)];
  }
});

const { Content } = Layout;

class MainContent extends React.Component {
  constructor(props) {
    super(props);
    const { username } = this.props;
    this.state = {
      username,
      current: 1,
      tasks: [],
      tasksAnnotaton: [],
      images: [],
      tasksStatus: [],
      visible: false,
      loading: false,
      managerFlag: ['ddz', 'DDZ'].includes(username),
      forceModify: false,
      firstKey: null,
      blockEnter: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.username !== prevState.username) {
      return {
        username: nextProps.username,
        current: 1,
        tasks: [],
        tasksAnnotaton: [],
        images: [],
        tasksStatus: [],
        visible: false,
        loading: false,
        managerFlag: ['ddz', 'DDZ'].includes(nextProps.username),
        forceModify: false,
        firstKey: null,
        blockEnter: false,
      };
    }
    return null;
  }
  componentDidMount () {
    document.onkeydown = onKeyDown;
    document.onkeyup = onKeyUp;
    var that = this
    function onKeyDown(e) {
        if(e.keyCode === 13) {
          e.preventDefault()
        }
    }
    function onKeyUp(e) {
      const { visible, tasksAnnotaton, current } = that.state;
      if(visible && e.keyCode !== 13) return
      // if(that.state.blockEnter && e.keyCode === 13) return
      if(e.keyCode >= 65 && e.keyCode <= 90){
          if(e.key !== firstKey) {
            firstKey = e.key
            that.setState({firstKey: e.key})
          }
          else {
            firstKey = null
            that.setState({firstKey: null})
          }
      }
      if(((e.keyCode >= 49 && e.keyCode <= 57) || 
        (e.keyCode >= 97 && e.keyCode <= 105)) && firstKey){
          secondKey = e.key
          console.log("按下组合键：",`${firstKey} + ${secondKey}`)
          that.onChildClick(null, null, firstKey, Number(secondKey)-1)
      }
      if(e.keyCode === 13 && !that.state.blockEnter) {
        e.preventDefault()
        if(visible) that.forceSubmit()
        else {
          const annotations = [];
          if(!tasksAnnotaton || !tasksAnnotaton[current - 1]) return;
          tasksAnnotaton[current - 1].forEach((item) => {
            annotations.push(...item);
          });
          if (annotations.length === 0) {
            that.showModal();
          } else that.submitTask()
        }
      }
      if(e.keyCode === 37 || e.keyCode === 38) {
        that.onNextPic(-1)
      }
      if(e.keyCode === 39 || e.keyCode === 40) {
        that.onNextPic(1)
      }
    }
  }

  async getTasks() {
    function getData() {
      return new Promise((resolve, reject) => {
        fetcher.postWithToken('/previous_tasks', (res) => {
          if (res.data.length === 0) {
            fetcher.postWithToken('/tasks', (res) => resolve(res));
          } else resolve(res);
        });
      });
    }
    const lazyLoad = async (allTasks) => {
      let imageTasks = allTasks
      let resImageTasks = []
      if(data.data.length > 5) {
        imageTasks = allTasks.slice(0, 5)
        resImageTasks = allTasks.slice(5)
      }
      let currentImages = await Promise.all(imageTasks.map(async (item) => {
        const imgUrl = await fetcher.getPro(`/img_src/${item.pid}/${item.iid}`);
        return imgUrl;
      }));
      this.state.images.push(...currentImages)
      this.setState({ images: this.state.images });
      if(resImageTasks.length > 0) setTimeout(() => {
        lazyLoad(resImageTasks)
      }, 100);
    }
    const data = await getData();
    const temp = [];
    for (let i = 0; i < data.data.length; i++) {
      const defaultSelection = [];
      for (let j = 0; j < Object.keys(annotations).length; j++) defaultSelection.push(new Array());
      temp.push(defaultSelection);
    }
    this.setState({
      tasks: data.data,
      tasksAnnotaton: temp,
      tasksStatus: new Array(data.data.length).fill(0),
      current: 1,
    });
    await lazyLoad(data.data)
    if (data.data.length === 0) message.warning('获取到的任务列表为空');
  }

  async submitTask(forceCommit, skip) {
    let {
      current,
      tasks,
      tasksAnnotaton,
      images,
      tasksStatus,
      forceModify,
    } = this.state;
    this.setState({ loading: true });
    const annotations = [];
    tasksAnnotaton[current - 1].forEach((item) => {
      annotations.push(...item);
    });
    if (annotations.length === 0 && !forceCommit && !skip) {
      return this.forceSubmit();
    }
    return new Promise(async (resolve, reject) => {
      // res的1,2,3代表提交失败、清除失败和成功
      const postRes1 = await fetcher.postPro('/task', {
        tid: tasks[current - 1].id,
        data: { annotations, confirmed: forceModify, skip: (skip ? true : false) },
        Token: fetcher.Token,
      }, null, true);
      if (postRes1.status === 'succeed') {
        const postRes2 = await fetcher.postPro('/complete_tasks', {
          ids: [tasks[current - 1].id],
          Token: fetcher.Token,
        }, null, true);
        if (postRes2.status === 'succeed') {
          message.success('提交成功');
          tasksStatus[current - 1] = 1;
          tasks.splice(current - 1, 1);
          images.splice(current - 1, 1);
          tasksStatus.splice(current - 1, 1);
          tasksAnnotaton.splice(current - 1, 1);
          if (current > tasks.length) {
            current = 1;
          }
          this.setState({
            tasks,
            tasksStatus,
            images,
            tasksAnnotaton,
            current,
            loading: false,
            forceModify: false,
          });
          resolve(3);
        } else {
          message.error('清除当前任务失败');
          resolve(2);
        }
      } else {
        message.error('提交标注结果失败');
        resolve(1);
      }
    });
  }

  onChildClick(name, value, keyStr, keyNum) {
    const { tasksAnnotaton, current } = this.state;
    if(!name) {
      name = Object.keys(annotations).find(item => {
        return item[0].toLowerCase() === keyStr;
      })
      if(!name || tasksAnnotaton.length === 0) return;
    }
    const res = tasksAnnotaton;
    const temp = res[current - 1];
    const index = Object.keys(annotations).indexOf(name);
    if (index === -1) return;
    if(!value) {
      value = Object.keys(annotations[name])[keyNum];
      if(!value) return;
    }
    const i = temp[index].indexOf(value);
    if (i === -1) temp[index].push(value);
    else temp[index].splice(i, 1);
    this.setState({
      tasksAnnotaton: res,
    });
  }

  onCardClick(name) { // 整张卡片点击
    const { tasksAnnotaton, current } = this.state;
    const res = tasksAnnotaton;
    const temp = res[current - 1];
    const index = Object.keys(annotations).indexOf(name);
    if (index === -1) return;
    if (temp[index].length > 0) temp[index] = [];
    else {
      Object.keys(annotations[name]).forEach((item) => {
        temp[index].push(item);
      });
    }
    this.setState({
      tasksAnnotaton: res,
    });
  }

  currentChange(value) {
    this.setState({
      current: value,
    });
  }

  getCurrent() {
    const { current } = this.state;
    return current;
  }

  onNextPic(num) {
    const { current, tasks } = this.state;
    let temp = current + num;
    if (temp > tasks.length) temp = 1;
    else if (temp === 0) temp = tasks.length;
    this.setState({ current: temp });
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

    hideModal = () => {
      this.setState({
        visible: false,
      });
    }

    forceSubmit() {
      this.setState({
        visible: false,
      });
      return this.submitTask(true);
    }

    forceModifyFlagChange() {
      const { forceModify } = this.state;
      this.setState({
        forceModify: !forceModify,
      });
    }

    toggleBlockEnter(value) {
      this.setState({blockEnter: value})
    }
    render() {
      const {
        username, current, tasks, tasksAnnotaton, images, tasksStatus, 
        visible, loading, managerFlag, forceModify
      } = this.state;
      const currentTask = tasks.length > current ? tasks[current - 1] : null;
      return (
        <Content className="main-content">
          <div className="main-content-root">
            <PicList username={username} getTasks={this.getTasks.bind(this)} current={current} currentChange={this.currentChange.bind(this)} images={images} tasks={tasks} />
            <div className="main-content-main">
              <PicPresenter currentTask={currentTask} getCurrent={this.getCurrent.bind(this)} currentChange={this.currentChange.bind(this)} currentImage={images[current - 1]} onNextPic={this.onNextPic.bind(this)} />
              <AnnSelector toggleBlockEnter={this.toggleBlockEnter.bind(this)} firstKey={this.state.firstKey} forceModifyFlagChange={this.forceModifyFlagChange.bind(this)} forceModify={forceModify} managerFlag={managerFlag} loading={loading} showModal={this.showModal.bind(this)} submitTask={this.submitTask.bind(this)} taskStatus={tasksStatus[current - 1]} annotations={annotations} onCardClick={this.onCardClick.bind(this)} onChildClick={this.onChildClick.bind(this)} selection={tasksAnnotaton[current - 1]} />
            </div>
          </div>
          <Modal
            title="提交空标注"
            maskClosable="false"
            visible={visible}
            onOk={this.forceSubmit.bind(this)}
            onCancel={this.hideModal}
            okText="确认"
            cancelText="取消"
          >
            <p>确定提交空标注吗？</p>
          </Modal>
        </Content>
      );
    }
}

export default MainContent;
