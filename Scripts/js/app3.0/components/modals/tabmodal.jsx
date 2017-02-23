/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : tabmodal.jsx
 * DESCRIPTION     : React tabbed pannel
 * AUTHOR          : cbenjamin
 * DATE            : Jan 19, 2017
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/
"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import Tabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import Button from '../ui/button';

class TabModal extends React.Component {

    constructor(props) {
        super(props);
        this.index = 1;
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.removeAllTabs = this.removeAllTabs.bind(this);

        this.onTabChange = this.onTabChange.bind(this);
        this.state = {value:'',
            activeKey: 'defaultname'};

    }

    getInitialState() {
        return {
            activeKey: 'defaultname',
        };
    };

    onTabChange(activeKey) {
        this.setState({
            activeKey,
        });
    };


    construct() {
        const disabled = true;

        return this.props.tabs.map((t) => {
            return (<TabPane
              tab={<span>{t.title}


                <a
            style={{
                position: 'absolute',
                cursor: 'pointer',
                color: 'red',
                right: 5,
                top: 0,
            }}
                onClick={this.remove.bind(this, t.title)}
          >x</a>
      </span>}
        key={t.title}
      >
        <div>
          {t.content}
        </div>
      </TabPane>);
          });
          };

remove(title, e) { console.log("remove:"+title);
              e.stopPropagation();;
              if (this.props.tabs.length === 1) {
                  return;
              }
              let foundIndex = 0;
              const after = this.props.tabs.filter((t, i) => {
                  if (t.title !== title) {
                      return true;
                  }
                  foundIndex = i;
                  return false;
              });
              let activeKey = this.state.activeKey;
              if (activeKey === title) {
                  if (foundIndex) {
                      foundIndex--;
                  }
                  activeKey = after[foundIndex].title;
              }
              this.props.tabs = after;
              this.setState({
                  activeKey
              });

              if (this.props.remove) {
                  this.props.remove(title);
              }
          };

          removeAllTabs(e){ 
              this.props.tabs.map((tab)=>{console.log(tab);
           this.remove(tab.title, e);
        });
    }


    add(e) {

        this.index++;
        const newTab = {
            title: `title: ${this.index}`,
            content: `content: ${this.index}`,
        };
        this.setState({
            activeKey: `name: ${this.index}`,
        });
    };

    render() {

        return (<div>
          <div>
            <Tabs
                   renderTabBar={() => <ScrollableInkTabBar extraContent={ <Button class="foo_btn" onClick={this.removeAllTabs.bind(this)} text="FOOBUTTON"/>}/>
                   }

    renderTabContent={() => <TabContent/>}
    activeKey={this.state.activeKey}
    onChange={this.onTabChange}
    remove={this.remove.bind(this)}
>
        {this.construct()}
        </Tabs>
            </div>
            </div>);
    };

}

export default TabModal;