/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : main.js
 * DESCRIPTION     : eplanner main page
 * AUTHOR          : louisz
 * DATE            : Jan 08, 2016
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

import Ajax             from 'wrapper/ajax'
import React            from 'react';
import ReactDOM         from 'react-dom';
import EplReact         from 'components/eplreact';
import Login			from 'components/login';

ReactDOM.render(
    <Login />,
    document.getElementById('epl')
);

