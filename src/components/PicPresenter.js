import React from 'react';
import {Icon} from 'antd';
import emptyImg from '../static/empty.png';
import Zmage from 'react-zmage'
import '../css/PicPresenter.less';
import '../../node_modules/slick-carousel/slick/slick.css';
import '../../node_modules/slick-carousel/slick/slick-theme.css';

class PicPresenter extends React.Component {
  render() {
    const controller={
      // 关闭按钮
      close: true,
      // 缩放按钮
      zoom: true,
      // 下载按钮
      download: true,
      // 旋转按钮
      rotate: true,
      // 翻页按钮
      flip: true,
      // 多页指示
      pagination: true,
    }
    const { currentImage, onNextPic, currentTask } = this.props;
    const src = currentImage || emptyImg;
    return (
      <div className="pic-presenter-root">
        <div className="pic-presenter-title">{currentTask ? `${currentTask.pid}-${currentTask.iid}` : ''}</div>
        <div className="pic-presenter-main">
          <div id="openseadragonl" style={{ textAlign: 'center'}}>
            <Zmage controller={controller} src={src} alt="chart" className="pic-presenter-img"/>
          </div>
          <div onClick={() => onNextPic(-1)} className="pic-button left"><Icon type="left" /></div>
          <div onClick={() => onNextPic(1)} className="pic-button right"><Icon type="right" /></div>
        </div>
      </div>
    );
  }
}

export default PicPresenter;
