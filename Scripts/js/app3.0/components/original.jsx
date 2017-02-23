/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : eplreact.js
 * DESCRIPTION     : static data file for eplanner basemap
 * AUTHOR          : yujianmin
 * DATE            : Dec 17, 2014
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
/*

<div class="map-content">
        <div id="header-top" class="header-top header-color">
            <div class="tools disable-selection">
                <div class="layer-list-div"><i class="iconfont layer-list">&#xf0025;</i></div>
                <div class="logo">
                    <img src="/Content/img/header/logo.png" class="logo-img" />
                </div>
                <ul class="tools-links">
                    <li id="bookmark"><i class="iconfont">&#xf0144;</i><div class="iconfont-name">Bookmark</div></li>
                    <li id="buffer"><i class="iconfont">&#xf01ea;</i><div class="iconfont-name">Buffer</div></li>
                    <li id="draw"><i class="iconfont">&#xf0199;</i><div class="iconfont-name">Draw</div></li>
                    <li id="reset"><i class="iconfont">&#xf015c;</i><div class="iconfont-name">Reset</div></li>
                </ul>
            </div>

            <div class="searchbox">
                <div class="search-wrapper">
                    <span class="search-icon"></span>
                    <input class="search-input" value="Search address e.g. 45 Maxwell Road">
                    <div id="locate-me"><i class="iconfont">&#xf01c5;</i><div class="iconfont-name">Locate</div></div>

                    <div class="search-suggest">
                        <div id="ss-content"></div>
                    </div><!-- Search suggest  -->
                </div>
                <div class="search-icons-div">
                    <span class="search-clear-icon"></span>
                </div>
            </div>

            <div class="right-tools">
                <ul class="right-links">
                    <li id="legend"><i class="iconfont">&#xf0161;</i><div class="iconfont-name">Legend</div></li>
                    <li id="dual-screen"><i class="iconfont">&#xf0091;</i><div class="iconfont-name">Dual</div></li>
                    <li id="info-list"><i class="iconfont">&#xf0142;</i><div class="iconfont-name">Metadata</div></li>
                    <li id="base-user"><i class="iconfont">&#xf012d;</i><div class="iconfont-name">Profile</div></li>
                    <li id="base-map"><i class="iconfont">&#xf00b9;</i><div class="iconfont-name">Basemap</div></li>

                </ul>

            </div>

        </div> <!-- Header end -->

        <div id="loading-div" class="loading-bar"></div>

        <div id="dacs-area"><span id="dacs-plotted-cases"></span><span> plotted</span></div>

        <div id="leafletMapCanvas">
        </div><!-- Map Canvas-->

        <div id="map-canvas">
        </div><!-- Map Canvas-->

        <div id="right-map">
            <div id="resize-handler">
            </div>
            <div id="right-basemap">
                <div class="right-basemap-icon"><i class="iconfont">&#xf00b9;</i><div class="iconfont-name">Basemap</div></div>
            </div>

            <div id="right-map-canvas"></div>
        </div> <!-- Map Canvas-->

        <div class="layer-info layer-info-color">
            <div class="layer-info-wrapper">
                <p><span id="li-msg">This is layer information.</span></p>
            </div>
        </div><!-- Layer data reminder info -->

        <div class="basemap-gallery basemap-gallery-color">
            <div class="si-title-wrapper si-title-color">
                <span class="si-title">Basemap</span>
                <span id="bm-back" class="right-close-btn right-close-btn-color"></span>
            </div>
            <div class="basemap-gallery-wrapper"></div>
        </div> <!-- Gallery End -->
    <!-- Left panel for map categories -->
        <div class="maplayers maplayers-color disable-selection" id="leftpanel">

            <div class="si-title-wrapper si-title-color">
                <span class="si-title">Analytics</span>
            </div>

            <div class="maplayers-selection">
                <div class="maplayers-selection-wrapper maplayers-selection-color">
                    <button class="al-btn selected-btn-color">All (<label id="al-number"></label>)</button> <button class="sl-btn pre-selected-btn-color">Selected</button>
                </div>
            </div>

            <div class="cate-search cate-search-color">
                <span class="search-icon"></span>
                <input id="cate-search" class="cate-search-color" placeholder="Search dataset..." />
            </div>

            <span class="cate-search-clear"></span>

            <div id="available-layers">
                <div class="cate-content"></div>
            </div> <!-- Available Layers -->

            <div id="selected-layers">
                <div id="sl-header" class="si-title-wrapper si-title-color">

                    <span class="si-title">Selected Layers <span class="cate-title-number">(<label id="sl-number">0</label>)</span></span>
                    <span class="s-closeall"></span>
                </div>

                <div id="sl-wrapper" style="height:220px;overflow-y:auto;overflow-x:hidden;">
                    <ul class="sl-wrapper"></ul>
                </div>

            </div> <!-- Selected Layers -->
        </div><!--  left panel for map layers-->

        <div id='timestamp-holder'>
            <div id="current-timestamp"></div> <img id='statistics-chart' class='btn' src='Scripts/js/app/exts/hccc/images/24x24/bar-graph1.png' />
        </div>

        <div id="filter-details" class="filter-color">
            <div class="si-title-wrapper si-title-color">
                <table class="filter-layers-title">
                    <tr>
                        <td>
                            <span>Filter</span>
                        </td>
                        <td>
                            <select id="filter-layers" class="select"></select>
                            <span class="filter-drop"></span>
                        </td>
                        <td id="filter-hide">
                            <span class="filter-down-icon"></span>
                        </td>
                    </tr>
                </table>
            </div>

            <div class="fo-wrapper">
                <div id="filter-slider"> </div>
                <table class="filter-options filter-options-color"></table>
            </div>
        </div><!-- show filter details -->

        <div id="show-filter-details" class="filter-color">
            <div class="si-title-wrapper si-title-color">
                <table class="filter-layers-title">
                    <tr>
                        <td>
                            <span>Filter</span>
                        </td>
                        <td id="filter-show">
                            <span class="filter-up-icon"></span>
                        </td>
                    </tr>
                </table>
            </div>
        </div> <!-- Hide filter div -->


        <div class="ura-logo"><img src="/Content/img/ura_logo_transparency.png" /></div>


        <div id="layerinformation" class="layerinformation-color">
            <div class="si-title-wrapper si-title-color">
                <span id="lmw-map-3-title" class="si-title">Layer Information</span>
                <span class="cw-loading"></span>
                <span id="li-back" class="right-close-btn right-close-btn-color"></span>
            </div>
            <div id="layerinfo-wrapper">
                <div class="nav-wrapper nav-wrapper-color">
                </div>
            </div>
            <div class="layerinfo-content-wrapper layerinfo-content-color">
                <div class="layer-map-wrapper">
                    <div class="map-description">
                        <h4>Description</h4><p id="map-3-des"></p>
                    </div>
                </div>

                <div class="layer-chart-wrapper">
                    <div class="select-wrapper"></div>
                    <div id="chart-wrapper"></div>
                </div>
            </div>

        </div> <!-- Layer information summary -->


        <div id="siteinformation" class="siteinformation-color">
            <div class="si-title-wrapper si-title-color">
                <span class="si-title">Layer Results </span>
                <span class="lr-loading"></span>
                <span id="siteinfo-resize" class="expand-icon expand-icon-color"></span>
                <span id="siteinfo-close" class="right-close-btn right-close-btn-color"></span>

            </div>
              <div id="si-content">

                <div id="lr-ul"></div>

                <div>
                    <div id="site-fixed" class="lr-title-wrapper site-fixed-unselected"><span class="lr-title">Site Information</span><span class="cate-minus-icon"></span></div>
                    <div class="site-fixed-info">
                        <table border="1">
                            <tr><td width="116px;">Address</td><td id="si-address"></td></tr>
                            <!--  <tr><td>Lot Address</td><td id="si-lot"></td></tr> -->
                            <tr><td>DA Polygon ID</td><td id="si-pol"></td></tr>
                            <tr><td>Planning Area</td><td id="si-pa"></td></tr>
                            <tr><td>Planning Subzone</td><td id="si-ps"></td></tr>
                            <tr><td>Constituency</td><td id="si-con"></td></tr>
                            <tr><td>Divisional Ward</td><td id="si-div"></td></tr>
                            <tr><td>MP Name</td><td id="mp-div"></td></tr>
                        </table>
                    </div>
                </div>

                <div class="lr-buffer-hint">
                    <table>
                        <tr>
                            <td><span>Try Buffer on Demographics ?</span></td>
                            <td><button id="lr-bh-demo" class="bh-ok">OK</button></td>
                        </tr>
                        <tr>
                            <td><span>Try Buffer on Housing Units ?</span></td>
                            <td><button id="lr-bh-hu" class="bh-ok">OK</button></td>
                        </tr>
                    </table>
                </div>

            </div>

        </div> <!-- Site information (layer Results) summary -->


        <div id="bufferinfo" class="bufferinfo-color">
            <div class="si-title-wrapper si-title-color">
                <span class="si-title">Buffer Tool</span>
                <span id="bufferinfo-resize" class="expand-icon expand-icon-color"></span>
                <span id="bufferinfo-close" class="right-close-btn right-close-btn-color"></span>
            </div>
            <div id="bt-content">
                <div class="buffer-wrapper">

                    <div id="buffer-options">
                        <div class="lr-title-wrapper"><span class="lr-title">Buffer Option</span><span class="cate-up-icon"></span></div>
                    </div>

                    <div class="bufferbtn-wrapper">
                        <div class="bt-title-wrapper bt-title-color">
                            <span class="bt-title">Click on map to perform query</span>
                        </div>
                        <div>
                            <button class="pointbuffer">Point</button>
                            <!--
    <button class="linebuffer clearbuffer" >Line</button>
    -->
                            <button class="polygonbuffer">Polygon</button>
                        </div>

                        <div class="bt-slider">
                            <div id="buffer-slider"></div>
                            <div> <label for="buffer-distance">Radius (meters): </label> <input id="buffer-distance" class="buffer-distance-input" type="text" /> </div>
                        </div>

                        <div>
                            <!--  button id="bu-btn" class="clearbuffer" >Change</button>--><button id="clearbuffer" class="clearbuffer">Clear</button>
                        </div>

                    </div>

                    <div class="si-title-wrapper si-title-color">
                        <span class="si-title">Buffer Results</span>
                        <span class="bf-loading"></span>
                    </div>
                    <div class="buffer-results">
                        <div id="br-ul">
                        </div>
                        <div class="buffer-hint">
                            <table>
                                <tr>
                                    <td><span>Add on Demographics ?</span></td>
                                    <td><button id="bh-demo" class="bh-ok">OK</button></td>
                                </tr>
                                <tr>
                                    <td><span>Add on Housing Units ?</span></td>
                                    <td><button id="bh-hu" class="bh-ok">OK</button></td>
                                </tr>

                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div> <!-- Buffer Tool Results-->

        <div id="draw-tool" class="draw-color">
            <div class="si-title-wrapper si-title-color">
                <span class="si-title">Draw Tool</span>
                <span id="draw-close-btn" class="right-close-btn right-close-btn-color"></span>
            </div>

            <div class="draw-wrapper">
                <div>
                    <div><span>Select Color</span></div>
                    <div id="color-palette">
                        <span id="color-1" class="color-button color-1 draw-selected-color"></span>
                        <span id="color-2" class="color-button color-2"></span>
                        <span id="color-3" class="color-button color-3"></span>
                        <span id="color-4" class="color-button color-4"></span>
                        <span id="color-5" class="color-button color-5"></span>
                    </div>
                </div>
                <div>
                    <table class="draw-table">
                        <tr id="pin-location" class="pin-location-tr">
                            <td width="60px">
                                <i style="color:#151515;font-size:28px;" class="iconfont">&#xf014a;</i>
                            </td>
                            <td>
                                <span>Pin a location</span>
                            </td>
                        </tr>

                        <tr id="draw-line" class="draw-line-tr">
                            <td width="60px">
                                <span class="draw-line"></span>
                            </td>
                            <td>
                                <span>Draw a line</span>
                            </td>
                        </tr>


                        <tr id="draw-rectangle" class="draw-rectangle-tr">
                            <td width="60px">
                                <span class="draw-rectangle"></span>
                            </td>
                            <td>
                                <span>Draw a rectangle</span>
                            </td>
                        </tr>


                        <tr id="draw-circle" class="draw-circle-tr">
                            <td width="60px">
                                <span class="draw-circle"></span>
                            </td>
                            <td>
                                <span>Draw a circle</span>
                            </td>
                        </tr>

                        <tr id="draw-polygon" class="draw-polygon-tr">
                            <td width="60px">
                                <span class="draw-polygon"></span>
                            </td>
                            <td>
                                <span>Draw a polygon</span>
                            </td>
                        </tr>

                        <tr id="clear-draw" class="clear-draw-tr">
                            <td width="60px">
                                <i style="color:#151515;font-size:28px;" class="iconfont">&#xf013f;</i>
                            </td>
                            <td>
                                <span>Clear Drawings</span>
                            </td>
                        </tr>

                    </table>

                </div>

                <div id="draw-result">

                </div>
            </div>
        </div> <!-- Draw Tool -->


        <div id="legend-div" class="legend-color">
            <div class="si-title-wrapper si-title-color">
                <span class="si-title">Legend</span>
                <span id="legend-close-btn" class="right-close-btn right-close-btn-color"></span>
            </div>

            <div class="legend-wrapper">
                <div id="mapLegend-content" title="Map Legend">
                    <div id="ll-content">
                        <div id="ll-content-select">
                            <label>Select layer: </label><select id="layer-select" class="layer-select-color"></select><span class="filter-drop"></span>
                        </div>
                        <div id="legend-details"></div>
                    </div>
                </div>
            </div>
        </div> <!-- legend -->

        <div id="popupMap-content" title="Basemap Information" style="width:538px;height:400px;display:none;">
            <div id="map-image" style="width:536px;height:300px;"></div>
            <div>
                <h4>Description:</h4>
                <div id="map-2-description"></div>
            </div>
        </div> <!-- base map information popup fancybox -->

        <div style="display:none" id="chart-content">
            <div id="pieOne"></div>
            <div id="tooltipOne" class="first-tooltip"></div>
            <div id="pieTwo"></div>
            <div id="tooltipTwo" class="second-tooltip"></div>
            <div id="pieThree"></div>
            <div id="tooltipThree" class="third-tooltip"></div>
        </div> <!-- Google/C3 Charts -->

        <div id="bookmarkinfo" class="bookmarkinfo-color">
            <div class="si-title-wrapper si-title-color">
                <span class="si-title">Bookmark</span>
                <span id="bk-title-close" class="right-close-btn right-close-btn-color"></span>
            </div>

            <div class="bookmark-wrapper">
                <div class="bookmark-add">
                    <table>
                        <tr>
                            <td style="width:80%;">
                                <input id="addbookmark" class="addbookmark-color" value="Site A" />
                            </td>
                            <td style="padding-right: 10px;width:20%;"> <button id="addbookmarkbtn" class="addbookmarkbtn-color">Add</button></td>
                        </tr>
                    </table>
                </div>
                <div class="bookmark-search">
                    <span class="search-icon"></span>
                    <input id="searchbookmark" class="searchbookmark-color" value="Search bookmark name" />
                </div>

                <div class="bookmark-content-wrapper">
                    <table id="bookmark-content"></table>
                </div>
            </div>

        </div> <!-- Bookmark Panel-->

        <div id="userinfo" class="userinfo-color">

            <div class="si-title-wrapper si-title-color">
                <span class="si-title">User Profile</span>
                <span id="profile-title-close" class="right-close-btn right-close-btn-color"></span>
            </div>

            <div class="userinfo-wrapper">
                <div class="si-title-wrapper ui-title-color">
                    <span id="userdisplay" class="userdisplay-color">Welcome, @username</span>
                </div>

                @*  Only allow change of password in Intranet *@
                @if (!Html.IsIntranet())
                {
                    <text>
                        <div class="si-title-wrapper ui-title-color helpspan">
                            <span id="change-pw">Change Password</span>
                        </div>
                    </text>
                }

                <!--
    <div class="si-title-wrapper ui-title-color helpspan">
        <span id="colorScheme">
            <div class="onoffswitch-color"><input type="checkbox" name="onoffswitch-color" class="onoffswitch-color-checkbox" id="colorSwitch" checked><label class="onoffswitch-color-label" for="colorSwitch"><span class="onoffswitch-color-inner"></span><span class="onoffswitch-color-switch"></span></label></div>
        </span>
    </div>
    -->
                <div class="si-title-wrapper ui-title-color helpspan">
                    <span id="begin-tour">Take A Tour</span>
                </div>
                <div class="si-title-wrapper ui-title-color helpspan">
                    <form id="logout-form" action="~/Account/Logout" method="GET"> <span><button id="logout-btn" type="submit">Log Out</button></span></form>
                </div>
            </div>
        </div> <!-- User profile -->

        <div style="display:none;" id="change-pw-content">
            <div class="change-pw-title">Change Password</div>

            <div id="changepw-res"></div>
            <div id="changepw-content">
                <table>
                    <tr>
                        <td class="change-pw-td"><label>Old Password</label></td>
                        <td> <input minlength=1 class="input change-pw-input" name="oldpassword" id="old-password" type="password" /></td>
                    </tr>

                    <tr>
                        <td class="change-pw-td"><label>New Password</label></td>
                        <td><input minlength=8 class="input change-pw-input" id="new-password" name="newpassword" type="password" /></td>
                    </tr>

                    <tr>
                        <td class="change-pw-td"><label>Confirm New Password</label></td>
                        <td><input minlength=8 class="input change-pw-input" id="confirm-password" name="confirmpassword" type="password" /></td>
                    </tr>

                    <tr>
                        <td></td>
                        <td id="change-pw-warning">*Passwords are not matched.</td>
                    </tr>

                    <tr>
                        <td><input type="hidden" name="agsusername" id="agsusername"></td>
                        <td><input type="button" class="login-button login-button-color" id="cancel-pw-btn" value="Cancel" /> <input class="login-button login-button-color" id="change-pw-btn" type="submit" value="Change" /></td>
                    </tr>

                </table>
            </div>

        </div> <!--change password dialog-->

        <div id="userinfo-details" class="userinfo-details-color">
            <div class="si-title-wrapper si-title-color">
                <span class="si-title" id="userinfo-title">User Profile</span>
                <span id="ud-back" class="back-btn">Close</span>
            </div>
            <div class="userinfo-table-wrapper">
                <table id="userinfo-table"></table>
            </div>
        </div> <!-- User profile details -->

        <div id="tourinfo" class="tourinfo-color">
            <div id="tourinfo-wrapper">
                <div id="tourinfo-detail">
                    <div id="tourinfo-title">Welcome to ePlanner 2.0</div>
                    This tour will guide you through some of the basic features of ePlanner
                    <div><button id="start-tour">Start Tour</button><button id="skip-tour">Skip</button></div>
                    <input type="checkbox" name="tourinfo-cb" id="tourinfo-cb" value="skip"><label for="tourinfo-cb" id="tourinfo-cblabel">Don't show the tour the next time</label>
                </div>
            </div>
        </div> <!-- Tour Guide  -->

        <div id="ue-control-panel">
            <div class="ua-control-btns">
                <button id="ue-control-home" class="selected-btn-color selected-btn-pa" data-flowtype="Home"><i class="icon iconfont">&#xf012b;</i></button>
                <button id="ue-control-work" data-flowtype="Work_"><i class="icon iconfont">&#xe7ab;</i></button>
            </div>
            <div id="ue-control-names">
                <span id="ue-control-pa"><label id="ue-pa-name"></label><span id="ue-control-clear"></span></span>
            </div>

        </div> <!--UE Home Work flow : data-flowtype is matching attributes in ArcGIS rest service-->

</div>

*/