/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : searchdisplay.js
 * DESCRIPTION     : Reactjs component for UserProfile
 * AUTHOR          : louisz
 * DATE            : Dec 17, 2015
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
import SearchStore from 'stores/searchstore';
import SearchDisplayRows from 'components/searchdisplayrows';
import Util from 'utils';

class SearchDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchResults: SearchStore.getSearchResults()
        }
    }

    componentDidMount() {
        SearchStore.addChangeListener(this._onChange.bind(this));
    }

    componentWillUnmount() {
        SearchStore.removeChangeListener(this._onChange.bind(this));
    }

    _onChange() {
        this.setState({
            searchResults: SearchStore.getSearchResults()
        });
    }

    setScrollbar(){
        if(this.refs.ssContent){
            Util.removePerfectScroll(this.refs.ssContent);
            Util.setPerfectScrollbar(this.refs.ssContent);
        }      
    }

    render() {
        var searchResults = this.state.searchResults;
        return (
            <div>
            {
                searchResults.length > 0 ?
                    <div className="search-suggest" style={this.props.style}>
                        <div ref="ssContent" id="ss-content" onMouseEnter={this.setScrollbar.bind(this)}>                     
                            {
                                this.setScrollbar(this.refs.ssContent)
                            }
                            <SearchDisplayRows data={searchResults} setSearchText={this.props.setSearchText} />
                        </div>
                    </div>
                : null
            }
            </div>
        );
    }
}

export default SearchDisplay;