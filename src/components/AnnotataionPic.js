import React from 'react';
import '../css/AnnodationPic.less';

class AnnotationPic extends React.Component {
  render() {
    const { picData, width, height } = this.props;
    var imgStyle = {}
    if(width || height) imgStyle = {width: width, height: height}
    return (
      <div className="annotation-pic-container" style={imgStyle}>
        <img
          alt="annotation"
          className="annotation-pic-img"
          style={imgStyle}
          src={picData}
        />
      </div>
    );
  }
}

export default AnnotationPic;
