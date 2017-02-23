Javascript Testing List
+ app3.0
	+ actions 
		- eplactioncreator.js -- no need for test file as it is a wrapper class
		- searchactioncreator.js -- [TODO] consider if required
	+ components
	+ constants -- no need for test file as they are all constants class
	+ dispatcher -- no need for test file as it is a wrapper class
	+ layers
		- layer.js
		- layercolfunc.js -- done
		- layerfactory.js -- no need for now, simple getter retrieval class
		- mapdata.js -- done
	+ libs -- no need for test file as they are all libraries
	+ search
	+ stores -- no need for test file as it is used as storage and exist only getter/setter functions
	+ wrapper
		- ajax.js -- no need for test file as it is a wrapper class
		- color.js -- no need for test file as it is a wrapper class
		- map.js -- file not used
		- statistics.js -- no need for test file as it is a wrapper class
	- basemap.js -- done
	- basemapconfig.js -- done
	- bookmarkmanager.js -- currently coding style uses window.localStorage directly.
	- drawmanager.js -- no need for now as it is going to be revamped
	- main.js -- no need for test file as it is basic setup of epl
	- profile.js -- file not used
	- serverconfig.js -- file not used
	- util.js -- test for some functions write, need to complete the rest
	- webapi.js