import React from 'react';
import {
  Button, Icon,
} from 'antd';
import ThuPresenter from './ThuPresenter';
import {getToken} from '../global/fetcher';
import '../css/PicList.less';

class PicList extends React.Component {
  constructor(props) {
    super(props);
    const {username} = this.props
    this.state = {
      username,
      loading: false,
      foldFlag: false,
      taskNum: 0,
    };
  }
  async UNSAFE_componentWillReceiveProps() {
    let res = await getToken()
    this.setState({ taskNum: res ? res.task_num : 0})
  }
  async UNSAFE_componentWillMount() {
    let res = await getToken()
    this.setState({ taskNum: res ? res.task_num : 0})
  }
    enterLoading = async () => {
      const { getTasks } = this.props;
      this.setState({ loading: true });
      await getTasks();
      this.setState({ loading: false });
    }

    onFold() {
      const { foldFlag } = this.state;
      const newFoldFlag = !foldFlag;
      if (newFoldFlag) this.refs.preListContainer.style.display = 'none';
      else this.refs.preListContainer.style.display = 'flex';
      this.setState({
        foldFlag: newFoldFlag,
      });
    }

    render() {
      const { loading, foldFlag, taskNum } = this.state;
      const {
        current, currentChange, imageData, tasks, images
      } = this.props;
      return (
        <div className="pic-list-root" ref="preListRoot">
          <div className="pic-list-main" ref="preListContainer">
            <Button className="pin-list-button" type="primary" loading={loading} onClick={this.enterLoading}>
                    {`Get Tasks${taskNum > 50 ? '' : `(${taskNum})`}`}
            </Button>
            <ThuPresenter current={current} currentChange={currentChange} imageData={imageData} tasks={tasks} images={images} />
          </div>
          <div onClick={this.onFold.bind(this)} className="fold-button">
            <Icon type={foldFlag ? 'right' : 'left'} />
          </div>
        </div>
      );
    }
}

export default PicList;
