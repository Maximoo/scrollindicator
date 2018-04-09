/**
 * Scroll Indicator file
 *
 * @link              http://charaplessa.com/
 * @since             1.0.0
 *
 * @jquery-plugin
 * Plugin Name:       Scroll Indicator
 * Plugin URI:        https://github.com/charaplessa/scrollindicator
 * Description:       Scroll Indicator adds a bar on your page, which indicates the percentage of the page that has been scrolled.
 * Version:           1.0.0
 * Author:            Chara Plessa
 * Author URI:        http://charaplessa.com/
 * License:           MIT
 */

// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
;
(function($, window, document, undefined) {

    "use strict";

    // undefined is used here as the undefined global 
    // variable in ECMAScript 3 and is mutable (i.e. it can 
    // be changed by someone else). undefined isn't really 
    // being passed in so we can ensure that its value is 
    // truly undefined. In ES5, undefined can no longer be 
    // modified.

    // window and document are passed through as local 
    // variables rather than as globals, because this (slightly) 
    // quickens the resolution process and can be more 
    // efficiently minified (especially when both are 
    // regularly referenced in your plugin).


    // Create the defaults once
    var pluginName = 'scrollindicator',
        defaults = {
            backgroundColor: 'transparent', // behind the bar color, if omitted the default is transparent
            color: null, // bar's color
            gradientFinish: null, // if set, the bar has a gradient color and color option is used for gradientStart,
                                  // if both color and gradientFinish options are omitted, bar has a gradient blue color
            where: undefined, // bar's position, eg: 'header' to be placed in <header>, or '#myheader' to be placed in $('#myheader'),
                              // if omitted, the bar by default is placed with fixed position at the top or at the bottom of the page according to position option
            position: 'top', // top or bottom, if top, the bar is placed at the top of $(where), if bottom, bar is placed at the bottom of $(where),
                             // if omitted, the default is top
            width: '5px' //bar's width, if omitted, width is set to 5px by default
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;

        // jQuery has an extend method that merges the 
        // contents of two or more objects, storing the 
        // result in the first object. The first object 
        // is generally empty because we don't want to alter 
        // the default options for future instances of the plugin
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype.init = function() {
        // Place initialization logic here
        // You already have access to the DOM element and
        // the options via the instance, e.g. this.element 
        // and this.options
        
        var pluginOptions = this.options;

        $('head')
            .append('<style type="text/css">#scroll-indicator{width:100%;background-color:violet;background-color:transparent;} #scroll-indicator-bar{width:0%;height:100%;-webkit-transition: all 0.3s;-moz-transition: all 0.3s;transition: all 0.5s;}</style>');
        
        
        //Object Literal to organize and name plugins' functions and callbacks, in order to avoid anonymous functions' usage
        var OL = {
            
            _window: $(window),
            
            _document: $(document),

            bar: null,
            
            barBg: null,
            
            scrollTop: null,
            
            docHeight: null,
            
            winHeight: null,
            
            scrollPercent: null,
            
            scrollPercentRounded: null,
            
            barHtml: "<div id='scroll-indicator'><div id='scroll-indicator-bar'></div></div>",
            
            css: null,
            
            
            onReady: function() {
                
                OL.placeBar();
                OL.giveColors();
                OL.giveWidth();
                OL.updateBar();
                OL.onScroll();               
 
            },
            
            placeBar: function (){
                
                if( pluginOptions.where === undefined ){
                    OL.placeFixed();
                }
                else {
                    OL.placeNonFixed();
                }
                
            },
            
            placeFixed: function() {
                    $('body').append(OL.barHtml);
                    OL.extractBar();
                    OL.barBg.css({'position':'fixed', 'z-index':' 10000000'});
                    
                    switch(pluginOptions.position) {
                        case 'bottom':
                            OL.barBg.css('bottom',' 0px');
                            break;

                        case 'top':
                        default:
                            OL.barBg.css('top',' 0px');
                    }
            },
            
            placeNonFixed: function() {
                    switch(pluginOptions.position) {
                        case 'bottom':
                            $(pluginOptions.where).append(OL.barHtml);
                            break;
                            
                        case 'top':
                        default:
                            $(pluginOptions.where).prepend(OL.barHtml);
                    }
                    OL.extractBar();
            },
            
            extractBar: function(){ 
                OL.bar = $('#scroll-indicator-bar');
                OL.barBg = $('#scroll-indicator');
            },
            
            giveColors: function() {
                OL.giveBarColor();
                OL.barBg.css('background-color', pluginOptions.backgroundColor);
            },
            
            giveBarColor: function() {
                if(pluginOptions.gradientFinish === null){
                    if(pluginOptions.color === null){
                        pluginOptions.color = 'rgb(1, 127, 150)';
                        pluginOptions.gradientFinish = 'rgb(87, 216, 235)';
                    }
                    else{
                        OL.bar.css('background-color', pluginOptions.color);
                    }
                }
                if(pluginOptions.gradientFinish !== null){
                    if(pluginOptions.color === null){
                        pluginOptions.color = 'black';
                    }
                    OL.bar.css('background-image', 'linear-gradient(130deg, '+pluginOptions.color+' 0px, '+pluginOptions.gradientFinish+' 100%)');
                }
            },
            
            giveWidth: function() {
                
                OL.barBg.css('height',pluginOptions.width);
                
            },
            
            onScroll: function() {
                OL._window.scroll(OL.updateBar);
            },
            
            updateBar: function() {
                OL.scrollPercentRounded = OL.getScrollPercent();
                OL.changeWidth();
            },
            
            getScrollPercent: function() {
                OL.scrollTop = OL._window.scrollTop();
		OL.docHeight = OL._document.height();
		OL.winHeight = OL._window.height();
		OL.scrollPercent = (OL.scrollTop) / (OL.docHeight - OL.winHeight);
		OL.scrollPercentRounded = Math.round(OL.scrollPercent*100);
                
                return OL.scrollPercentRounded;
            },
            
            changeWidth: function() {
                OL.bar.css('width', OL.scrollPercentRounded+'%');
            }

        };

        OL._document.ready(OL.onReady);
    
    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);