﻿/**-------------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------*/
"use strict";

import React from 'react';

 import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'


class BottomSheet extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
        
    }

    componentDidMount() {
         
    }

    componentWillUnmount() {
         
    }

    _onChange() {
    
    }

 
 
    render() {
        const { visible } = this.state.visible
        return (
            <div>
        <Button onClick={this.toggleVisibility}>Toggle Visibility</Button>
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} animation='push' direction='bottom' visible={visible} inverted>
            <Menu.Item name='home'>
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item name='gamepad'>
              <Icon name='gamepad' />
              Games
            </Menu.Item>
            <Menu.Item name='camera'>
              <Icon name='camera' />
              Channels
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <Header as='h3'>Application Content</Header>
              <Image src='/assets/images/wireframe/paragraph.png' />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
        );
    }
}

export default BottomSheet;