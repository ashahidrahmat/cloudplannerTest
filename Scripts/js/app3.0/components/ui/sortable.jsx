/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : selected.js
 * DESCRIPTION     : Reactjs component for LeftPanel
 * AUTHOR          : louisz
 * DATE            : Apr 6, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        : Pass in the following attributes:
                        1) items:Array (list of items to be sortable/draggable)
                        2) components:React.Component (the component for each of the row, TODO: refactor this component to be specific type)
                        3) onUpdate:Function(array) (the function to call when update occurs)
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/

"use strict";

import React from 'react';
import EplActionCreator from 'actions/eplactioncreator';

import $ from 'jquery';
import  'libs/jqueryui/jqueryui-sortable';

class Sortable extends React.Component {

    componentDidMount() {
        $(this.refs.sortable).sortable({
            handle: "." + this.props.component.getSelectable(),
            stop: this.stopLayerOrder.bind(this)
        });
    }

    componentWillUnmount() {
        $(this.refs.sortable).sortable( "destroy" );
    }

    stopLayerOrder(event, ui) {
        // Get array of new index
        let domNode = $(this.refs.sortable),
            newOrder = domNode.sortable('toArray', {attribute: 'data-react-sortable-pos'});
        // Cancel the srt so that the DOM is untouched
        domNode.sortable('cancel');
        // Update the store to let React draw it instead
        this.props.onUpdate(newOrder);
    }

    itemsToComponents(Component, items) {
        return items.map((item, i) => {
            return <Component key={item.getName()} item={item} reactSortablePos={i} />;
        });
    }

    render() {
        var items = this.itemsToComponents(this.props.component, this.props.items);

        return (
            <ul ref="sortable" className="sl-wrapper">{items}</ul>
        );
    }
}

export default Sortable;