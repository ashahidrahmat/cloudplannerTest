/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : multiselecttogglebutton.js
 * DESCRIPTION     : MultiSelectToggleButton component
 * AUTHOR          : louisz
 * DATE            : Apr 11, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        : Pass in the following attributes:
                        1) layer:Layer (Layer that this component is associate with)
                        2) layerList:Array <Object{name, layerId}> (Toggle object list)
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/

import Util from '\\util';
import React from 'react';

class View extends React.Component {
    render() {
        return <div>{this.props.children}</div>;
    }
}

export default View;