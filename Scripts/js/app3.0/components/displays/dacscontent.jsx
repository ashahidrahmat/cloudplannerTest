/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : dacscontent.js
 * DESCRIPTION     : Reactjs component for DACS case content description
 * AUTHOR          : jianmin
 * DATE            : June 28, 2016
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

import Util from 'utils';
import React from 'react';

class DacsContent extends React.Component {

    render() {
        let contents = this.props.contents;

        var displayContent = contents.map((item, index) => {

                return (<div key={"dacscase-"+index} className="dacs-info">
                               <table>
                                   <tr>
                                       <th className="dacs-info-link" colSpan={2}>
                                           <a className="dacs-info-link" href={item.detailUrl} target="_blank">View Case Details</a>
                                       </th>
                                   </tr>
                                   
                                   <tr>
                                       <td className="dacs-td-1">Reference No.: </td>
                                       <td className="dacs-td-2">item.refNo</td>
                                   </tr>

                                   <tr>
                                       <td className="dacs-td-1">System: </td>
                                       <td className="dacs-td-2">item.systemId</td>
                                   </tr>

                                   <tr>
                                        <td className="dacs-td-1">Dead Line: </td>
                                        <td className="dacs-td-2">item.deadLine</td>
                                   </tr>

                                   <tr>
                                        <td className="dacs-td-1">Planning Area: </td>
                                        <td className="dacs-td-2">item.planningArea</td>
                                   </tr>
                                   
                                   <tr>
                                        <td className="dacs-td-1">Postal Code: </td>
                                        <td className="dacs-td-2">item.postalCode</td>
                                   </tr>

                                   <tr>
                                        <td className="dacs-td-1">Application Status: </td>
                                        <td className="dacs-td-2">item.status</td>
                                   </tr>

                                   <tr>
                                        <td className="dacs-td-1">Description: </td>
                                        <td className="dacs-td-2">item.description</td>
                                   </tr>
                               </table>
                        </div>);
            });

        return (<div>{displayContent.join('')}</div>);
    }
}

export default DacsContent;
