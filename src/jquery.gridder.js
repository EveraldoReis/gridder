;(function($) {
    
    /* CUSTOM EASING */
    $.fn.extend($.easing,{
        def:"easeInOutExpo", easeInOutExpo:function(e,f,a,h,g){if(f===0){return a;}if(f===g){return a+h;}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a;}return h/2*(-Math.pow(2,-10*--f)+2)+a;}
    });    
    
    $.fn.gridderExpander = function(options) {
        
        /* GET DEFAULT OPTIONS OR USE THE ONE PASSED IN THE FUNCTION  */
        var settings = $.extend( {}, $.fn.gridderExpander.defaults, options );      

        return this.each(function() {
            
            var mybloc;
            var _this = $(this);
            var visible = false;
            
            /* START CALLBACK */
            settings.onStart(_this);
            
            // Close Function
            function closeExpander(base, settings) {
                
                // SCROLL TO CORRECT POSITION FIRST
                $("html, body").animate({
                    scrollTop: base.find(".selectedItem").offset().top - settings.scrollOffset
                }, {
                    duration: 200,
                    easing: settings.animationEasing
                });
                
                 _this.removeClass("hasSelectedItem");

                // REMOVES GRIDDER EXPAND AREA
                visible = false;
                base.find(".selectedItem").removeClass("selectedItem");
                
                base.find(".gridder-show").slideUp(settings.animationSpeed, settings.animationEasing, function() {
                    base.find(".gridder-show").remove();
                    settings.onClosed(base);
                });
            }
            
            /* CLICK EVENT */
            _this.find(".gridder-list").on("click", function(e) {
                e.stopPropagation(); 
                
                var myself = $(this);
                
                /* ENSURES THE CORRECT BLOC IS ACTIVE */
                if (!myself.hasClass("selectedItem")) {
                    _this.find(".selectedItem").removeClass("selectedItem");
                    myself.addClass("selectedItem");
                }else{
                    // THE SAME IS ALREADY OPEN, LET"S CLOSE IT
                    closeExpander(_this, settings);
                    return;
                }
                
                /* REMOVES PREVIOUS BLOC */
                _this.find(".gridder-show").remove(); 
                
                /* SCROLL TO CORRECT POSITION FIRST */
                var offset = (settings.scrollTo === "panel" ? myself.offset().top + myself.height() - settings.scrollOffset : myself.offset().top - settings.scrollOffset );               
                $("html, body").animate({
                    scrollTop: offset
                }, {
                    duration: settings.animationSpeed,
                    easing: settings.animationEasing
                });
                
                /* ADD CLASS TO THE GRIDDER CONTAINER
                 * So you can apply global style when item selected. 
                 */
                if (!_this.hasClass("hasSelectedItem")) {
                    _this.addClass("hasSelectedItem");
                }
 
                /* ADD LOADING BLOC */
                var $htmlcontent = $("<div class=\"gridder-show loading\"></div>");
                mybloc = $htmlcontent.insertAfter(myself);
                
                /* EXPANDED OUTPUT */
                var currentcontent = myself.find(".gridder-content").html();
                var htmlcontent = "<div class=\"gridder-padding\">";
                         htmlcontent += "<div class=\"gridder-navigation\">";
                                htmlcontent += "<a href=\"#\" class=\"gridder-close\">Close</a>";
                                htmlcontent += "<a href=\"#\" class=\"gridder-nav prev\">Previous</a>";
                                htmlcontent += "<a href=\"#\" class=\"gridder-nav next\">Next</a>";
                        htmlcontent += "</div>";
                        htmlcontent += "<div class=\"gridder-expanded-content\">";
                            htmlcontent += currentcontent;
                        htmlcontent += "</div>";
                htmlcontent += "</div>";
                mybloc.html(htmlcontent);

                // IF EXPANDER IS ALREADY EXPANDED 
                if (!visible) {
                    mybloc.find(".gridder-padding").slideDown(settings.animationSpeed, settings.animationEasing, function() {
                        visible = true;

                        /* AFTER EXPAND CALLBACK */
                        if ( $.isFunction( settings.onExpanded ) ) {
                            settings.onExpanded( mybloc );
                        }
                    });
                } else {
                    mybloc.find(".gridder-padding").fadeIn(settings.animationSpeed, settings.animationEasing, function() {
                        visible = true;

                        /* CHANGED CALLBACK */
                        if ( $.isFunction( settings.onChanged ) ) {
                            settings.onChanged( mybloc );
                        }
                    });
                }            
            });
            
            /* NEXT BUTTON */
            _this.on("click", ".gridder-nav.next", function(e) {
                e.preventDefault();
                $(this).parents(".gridder-show").next().trigger("click");
            });

            /* PREVIOUS BUTTON */
            _this.on("click", ".gridder-nav.prev", function(e) {
                e.preventDefault();
                $(this).parents(".gridder-show").prev().prev().trigger("click");
            });
            
            /* CLOSE BUTTON */
            _this.on("click", ".gridder-close", function(e) {
                e.preventDefault();
                closeExpander(_this, settings);
            });

        });
    };
    
    // Default Options
    $.fn.gridderExpander.defaults = {
        scrollOffset: 30,
        scrollTo: "panel", // panel or listitem
        animationSpeed: 400,
        animationEasing: "easeInOutExpo",
        onStart: function(){
            console.log("Gridder Inititialized");
        },
        onExpanded: function(){
            console.log("Gridder Expanded");
        },
        onChanged: function(){
            console.log("Gridder Changed");
        },
        onClosed: function(){
            console.log("Gridder Closed");
        }
    };
    
})(jQuery);