/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : urlconstants.js
 * DESCRIPTION     : static data file for eplanner basemap
 * AUTHOR          : louisz
 * DATE            : Feb 03, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      : 
 * RETURN          :     
 * USAGE NOTES     :
 * COMMENTS        : 
---------------------------------------------------------------------------------------------------
 * CHANGE LOG  	   : 
 * CHANGED BY      : 
 * DATE            : 
 * VERSION NO      : 
 * CHANGES         : 
--------------------------------------------------------------------------------------------------*/

export var ChartOrientation = {
    Vertical: 0,
    Horizontal: 1
};

// below two values must match, 
// prop => ReactJS prop, opt => C3.js chartOption
//must be first level option setting data i.e. chartOptions.size, not chartOptions.data.groups
export var ChartPropOptPairs = [
     {
         prop: 'chartSize',
         opt:'size'
     },
     {
         prop: 'chartTooltip',
         opt:'tooltip'
     },
     {
         prop: 'chartPadding',
         opt:'padding'
     },
     {
         prop: 'chartColor',
         opt: 'color'
     },
     {
         prop: 'chartLegend',
         opt: 'legend'
     },
     {
         prop: 'chartBar',
         opt: 'bar'
     }
];   

//color code
export var ChartColors = {
     Theme: '#4787ed',
     Red: '#FF0000',
     DeepPink:'#FA5882',
     Pink: '#ED99A0',
     Green: '#04B404',
     Blue: '#0000FF',
     DodgerBlue: '#2E9AFE',
     Orange: '#FFBF00',
     LightOrange: '#FCE649',
     Yellow: '#FFFF00',
     Grey: '#D8D9D7',
     Purple: '#CB00F5',
     LightPurple: '#B8B8FF',
     LightGrey: '#909090',
     DarkGreen:'#2CA02C',
     DarkOrange: '#FF7F0E',
     DarkBlue: '#1F77B4',
     DeepBlue: '#1A6CE8',
     DeepGreen: '#74B374',
     Dark: '#000',
};

export var ExistingLandUseColors = {
    pattern: ['#F0E68C', '#939A9C', '#F0E68C', '#D6B3C9', '#E88184', '#F0E68C', '#FFFF7D', '#CD001F', 
              '#4F6600', '#A9B300', '#33ACE5', '#FFECBF', '#9F8800', '#8C875B', '#A3D39C', '#CD001F',
              '#007BA0', '#1F519A', '#F19C33', '#F2F2C1', '#00A33A', '#D6B3C9', '#CD001F', '#939A9C',
              '#D1D1D1','#F0E68E','#FAF8C9','#AAA3C9','#F1E794']
};

export var GazettedLandUseColors = {
    pattern: ['#F19C33', '#B10066', '#F5BA82', '#00A33A', '#4F6600', '#FFF36F', '#A3D39C', '#F5F3F3', '#CD001F', '#939A9C', '#CD001F', '#BFDEF5',
               '#8C875B', '#D5ACC8', '#CD001F', '#1F519A', '#33ACE5', '#9F8800', '#939A9C', '#007BA0', '#007BA0', '#F0E68C', '#A59FC6', '#F0E68C',
               '#D1D1D1','#FAF8C9','#D5ACC8','#F3BCBD', '#A9B301', '#1C89AA','#F2F2C4','#B91A75','#F6C07E']
};
