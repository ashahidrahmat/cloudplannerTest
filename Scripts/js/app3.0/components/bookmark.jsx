/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : tourguide.js
 * DESCRIPTION     : Reactjs component for TourGuide
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
import BookmarkStore from 'stores/bookmarkstore';
import EplActionCreator from 'actions/eplactioncreator';
import Util from 'utils';

class Bookmark extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            bookmarks: BookmarkStore.getBookmarks(),
            bookmarkName: "Site A",
            search: ''
        };

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        let content = this.refs.cateContent;
        Util.setPerfectScrollbar(content)

        BookmarkStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        BookmarkStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({
            bookmarks: BookmarkStore.getBookmarks()
        });
    }

    toDisplay(bookmarks) {
        return bookmarks.map(bookmark => {
            return (
                <tr key={bookmark.key}>
                    <td className="bkmark-name" onClick={this.focusToBookmark.bind(this, bookmark.key)}>
                        <span className="bk-text">{bookmark.name}</span>
                        <small className="bk-text">{bookmark.date} {bookmark.time}</small>
                    </td>
                    <td>
                        <span className="s-close bk-close" onClick={this.removeBookmark.bind(this, bookmark.key)}></span>
                    </td>
                </tr>
            );
        });
    }

    focusToBookmark(key) {
        let bookmark = BookmarkStore.getBookmark(key);

        if (bookmark) {
            EplActionCreator.highlightZoomCenterMap(null, parseInt(bookmark.zoom), {
                lat: bookmark.lat,
                lng: bookmark.lng
            });
        }
    }

    addBookmark() {
        EplActionCreator.addBookmark(this.state.bookmarkName);
    }

    removeBookmark(key) {
        EplActionCreator.removeBookmark(key);
    }

    onChangeBookmarkName(e) {
        this.setState({
            bookmarkName: e.target.value
        });
    }

    onChangeSearch(e) {
        this.setState({
            search: e.target.value
        });

        EplActionCreator.searchBookmark(e.target.value);
    }

    closeMenu() {
        EplActionCreator.closeMenu();
    }

    render() {
        var display = this.toDisplay(this.state.bookmarks);

        return (
            <div id="bookmarkinfo" className="bookmarkinfo-color">
                <div className="si-title-wrapper si-title-color">
                    <span className="si-title">Bookmark</span>
                    <span id="bk-title-close" className="right-close-btn right-close-btn-color" onClick={this.closeMenu.bind(this)}><i className="icon-cancel-circled"></i></span>
                </div>
                <div className="bookmark-wrapper" ref="cateContent">
                    <div className="bookmark-add">
                        <table>
                            <tbody>
                            <tr>
                                <td><input id="addbookmark" className="addbookmark-color" defaultValue="Site A" value={this.state.bookmarkName}  onChange={this.onChangeBookmarkName.bind(this)} /></td>
                                <td><button id="addbookmarkbtn" className="addbookmarkbtn-color" onClick={this.addBookmark.bind(this)}>Add</button></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="bookmark-search">
                        <span className="search-icon"></span>
                        <input id="searchbookmark" className="searchbookmark-color" placeholder="Search bookmark name" onChange={this.onChangeSearch.bind(this)} />
                    </div>
                    <div className="bookmark-content-wrapper">
                        <table id="bookmark-content"><tbody>{display}</tbody></table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Bookmark;
