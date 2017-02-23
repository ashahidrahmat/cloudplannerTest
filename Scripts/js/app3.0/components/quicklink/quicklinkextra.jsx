/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : quicklinketra.js
 * DESCRIPTION     : child component of quicklink.jsx
 * AUTHOR          : xingyu
 * DATE            : Dec 29, 2016
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
import { Dropdown, Image } from 'semantic-ui-react';


var a = function(){
    console.log("a");
}

const trigger = (
  <span>
    <Image avatar src="http://image.flaticon.com/icons/png/128/149/149023.png" />
  </span>

 
)

var QuicklinkExtra = () => (
  <Dropdown trigger={trigger} pointing='top left' icon={null}>
    <Dropdown.Menu>
      <Dropdown.Item text='.........................'  />
      <Dropdown.Item text='.............................'/>
      <Dropdown.Item text='..............................'/>
    </Dropdown.Menu>
  </Dropdown>
)

export default QuicklinkExtra
