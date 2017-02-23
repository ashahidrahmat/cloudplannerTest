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
import Util from 'util';

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

    setScrollbar(content){
        Util.removePerfectScroll(content);
        Util.setPerfectScrollbar(content);
    }

    render() {
        var searchResults = this.state.searchResults;
        return (
            <div>
            {
                searchResults.length > 0 ?
                <div>
                    <div className="search-suggest">
                        <div ref="ssContent" id="ss-content">
                            <SearchDisplayRows data={searchResults} setSearchText={this.props.setSearchText} />
                            {
                                this.setScrollbar(this.refs.ssContent)
                            }
                        </div>
                    </div>
                </div>
                : null
            }
            </div>
        );
    }
}

export default SearchDisplay;