import React from 'react';
import { Popover } from 'antd';
import AnnotationPic from './AnnotataionPic';
import categories from '../static/categories.json';
import '../css/AnnotationsCard.less';

class AnnotationCard extends React.Component {
  findText = (class1, label) => {
    let currentItem = { Eng: '', ChnDescription: '', class1Eng: '' };
    if (categories[class1]) {
      if(!label) return { class1Eng: categories[class1].Eng }
      currentItem = categories[class1].Subtypes.find((item) => (item.Label === label));
    }
    return currentItem;
  }

  render() {
    const {
      focused, taskStatus, selectedArr, onChildClick, onCardClick, class1, annArr,
    } = this.props;
    const cursor = taskStatus === 0 ? null : 'not-allowed';
    const pointerEvents = taskStatus === 0 ? 'all' : 'none';
    const title = (text) => <span style={{ textAlign: 'center' }}>{text}</span>;
    const content = (images, text) => (
      <div style={{ maxWidth: '360px' }}>
        <div style={{}}>{text}</div>
        <div className="ann-card-hover-card">
          {images.map((item1, index1) => (
            <div key={index1} style={{ margin: '0 10px' }}>
              <AnnotationPic width={160} height={120} picData={item1} />
            </div>
          ))}
        </div>
      </div>
    );
    let n = Object.keys(annArr).length
    var cardWidth = n % 2 === 0 ? `${120*n}px` : `${120*n}px`
    let rootClassName = focused ? "ann-card-root class1-checked" : "ann-card-root class1-unchecked"
    return (
      <div style={{pointerEvents, cursor, width: cardWidth}} className={rootClassName}>
        <div onClick={() => onCardClick(class1)} className="ann-card-header">
          {this.findText(class1, null).class1Eng}
        </div>
        <div className="ann-card-main">
          {Object.keys(annArr).map((item, index) => {
            const checked = selectedArr && selectedArr.includes(item);
            const currentItem = this.findText(class1, item) ? this.findText(class1, item) : { Eng: '', ChnDescription: '' };
            let className = checked ? "ann-card-item checked" : "ann-card-item unchecked"
            return (
              <div
                onClick={() => onChildClick(class1, item)}
                key={index}
                className={className}
              >
                <Popover mouseEnterDelay={1.5} placement="left" title={title(currentItem.Eng)} content={content(annArr[item], currentItem.ChnDescription)}>
                  <div className="title">{`${index+1}. ${currentItem.Eng}`}</div>
                  <AnnotationPic picData={annArr[item][0]} />
                </Popover>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default AnnotationCard;
