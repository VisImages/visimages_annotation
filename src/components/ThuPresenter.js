import React from 'react';
import { Pagination, Divider, Icon } from 'antd';
import Slider from 'react-slick';
import '../css/ThuPresenter.less';
import '../../node_modules/slick-carousel/slick/slick.css';
import '../../node_modules/slick-carousel/slick/slick-theme.css';

class ThuPresenter extends React.Component {
  UNSAFE_componentWillReceiveProps() {
    this.refs.thuSlider.slickGoTo(this.props.current-1)
  }

  itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return <a>previous</a>;
    }
    if (type === 'next') {
      return <a>next</a>;
    }
    return originalElement;
  }

    onChange = (page) => {
      const { currentChange, current } = this.props;
      currentChange(page);
      if (page < current) this.refs.thuSlider.slickPrev();
      else if (page > current) this.refs.thuSlider.slickNext();
    }

    next() {
      this.refs.thuSlider.slickNext();
    }

    prev() {
      this.refs.thuSlider.slickPrev();
    }
    onSwipe(value) {
      console.log("onSwipedddsf地方d", value)
    }

    render() {
      let { current, tasks, images } = this.props;
      const that = this;
      const slidesToShow = tasks.length > 5 ? 5 : tasks.length;
      const settings = {
        centerMode: true,
        centerPadding: "0px",
        focusOnSelect: true,
        infinite: true,
        slidesToShow,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        swipeToSlide: true,
        swipe: true,
        beforeChange(currentSlide, nextSlide) {
          console.log('before change', currentSlide, nextSlide);
        },
        afterChange(currentSlide) {
          console.log('after change', currentSlide);
          if(currentSlide < 0) return;
          that.props.currentChange(currentSlide + 1);
        },
      };
      return (
        <div className="thu-presenter-root">
          <div className="thu-presenter-header">
            <Pagination current={current} onChange={this.onChange.bind(this)} simple pageSize={1} total={tasks.length} itemRender={this.itemRender} />
          </div>
          <Divider className="thu-presenter-divider"/>
          <div className="thu-presenter-main">
            <Slider ref="thuSlider" {...settings}>
              {images.map((item, index) => (
                <div refs={`thu${index}`} key={index} className={current === index + 1 ? 'thu-item current-item' : 'thu-item'}>
                  <img className="thu-presenter-img" src={item} alt={"picture"+index}/>
                </div>
              ))}
            </Slider>
            <div onClick={this.prev.bind(this)} className="thu-presenter-button up"><Icon type="up" /></div>
            <div onClick={this.next.bind(this)} className="thu-presenter-button down"><Icon type="down" /></div>
          </div>
        </div>
      );
    }
}

export default ThuPresenter;
