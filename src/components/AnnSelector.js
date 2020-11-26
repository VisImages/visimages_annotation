import React from 'react';
import { Input, Button, Checkbox, Icon, Tooltip } from 'antd';
import AnnotationsCard from './AnnotationsCard';
import '../css/AnnSelector.less';

const { Search } = Input;

class AnnSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
  }

    enterLoading = async (skip) => {
      const annotations = [];
      const { selection, showModal, submitTask } = this.props;
      selection.forEach((item) => {
        annotations.push(...item);
      });
      if (annotations.length === 0 && !skip) {
        showModal();
        return;
      }
      await submitTask(null, skip);
    }

    searchChange(e) {
      console.log(e.target.value);
      this.setState({
        search: e.target.value,
      });
    }

    render() {
      const {
        toggleBlockEnter, firstKey, annotations, forceModify, managerFlag, forceModifyFlagChange, loading, selection, taskStatus, onChildClick, onCardClick,
      } = this.props;
      const { search } = this.state;
      let keys = Object.keys(annotations);
      let keysStore = Object.keys(annotations);
      // keys.splice(1, 0, null, null)
      // keys.splice(5, 0, null, null)
      // keys.splice(9, 0, null, null)
      // keys.splice(13, 0, null, null)
      keys.splice(2, 0, null, null)
      keys.splice(7, 0, null, null, null)
      keys.splice(12, 0, null, null)
      keys.splice(16, 0, null, null)
      keys.splice(21, 0, null, null, null)
      // keys.splice(2, 0, null, null)
      // keys.splice(7, 0, null)
      // keys.splice(10, 0, null, null)
      // keys.splice(14, 0, null, null)
      // keys.splice(19, 0, null)
      let display = managerFlag ? 'inline-block' : 'none'
      let class1Name = Object.keys(annotations).find(item => {
        return item[0].toLowerCase() === firstKey;
      })
      const optionsTitle = (
        <div className="options-intro-card">
          <div className="title">快捷键说明：</div>
          <div className="content">1. 类型选择和取消：字母选择大类，数字键确认选择大类下的小类(如a+1选择Area大类下的area chart);</div>
          <div className="content">2. 确认提交： Enter键;</div>
          <div className="content">3. 图例查看： 鼠标悬停在小类的图标上，展示出小类的所有图例</div>
        </div>
      )
      return (
        <div className="ann-selector-root">
          <div className="ann-selector-head">
            <div className="ann-selector-head-item title">Selection Panel</div>
            <Tooltip placement="right" title={optionsTitle}>
              <Icon className="ann-selector-options-info" type="exclamation-circle" />
            </Tooltip>
            <div style={{display}}>
              <Checkbox checked={forceModify} disabled={!managerFlag} onChange={forceModifyFlagChange}>强行修改</Checkbox>
            </div>
            <div className="ann-selector-head-item search">
              <Search
                size="large"
                placeholder="Search"
                onSearch={(v) => console.log(v)}
                onChange={this.searchChange.bind(this)}
                enterButton
                onFocus={() => toggleBlockEnter(true)}
                onBlur={() => toggleBlockEnter(false)}
              />
            </div>
          </div>
          <div className="ann-selector-main">
            {
                    keys.filter((item) => {
                      if(!item) return true
                      if (item.includes(search.toLowerCase())) return true;

                      const childKeys = Object.keys(annotations[item]);
                      for (let a = 0; a < childKeys.length; a++) {
                        if (childKeys[a].includes(search.toLowerCase())) return true;
                      }

                      return false;
                    }).map((item, index) => {
                      if (!selection) return null;
                      if(!item) return <div key={index} className="ann-selector-gost-0"></div>
                      let focused = false
                      if(item === class1Name) focused = true
                      return (
                        <AnnotationsCard
                          focused={focused}
                          taskStatus={taskStatus}
                          class1={item}
                          annArr={annotations[item]}
                          selectedArr={selection[keysStore.indexOf(item)]}
                          key={index}
                          onChildClick={onChildClick.bind(this)}
                          onCardClick={onCardClick.bind(this)}
                        />
                      );
                    })
                }
            <div className="ann-selector-gost" />
            <div className="ann-selector-gost" />
          </div>
          <div className="ann-selector-footer">
            {managerFlag ? (<Button type="primary" loading={loading} onClick={() => this.enterLoading(true)} disabled={taskStatus !== 0}>
              跳过
            </Button>) : ""}
            <Button type="primary" loading={loading} onClick={() => this.enterLoading(false)} disabled={taskStatus !== 0}>
              {taskStatus === 0 ? 'Submit(enter)' : '已提交'}
            </Button>
          </div>
        </div>
      );
    }
}

export default AnnSelector;
