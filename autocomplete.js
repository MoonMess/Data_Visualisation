function autocomplete(parent) {
    var _data=null,
        _delay= 0,
        _selection,
        _margin = {top: 30, right: 10, bottom: 50, left: 80},
        __width = 420,
        __height = 420,
        _placeHolder = "Search",
        _width,
        _height,
        _matches,
        _searchTerm,
        _lastSearchTerm,
        _currentIndex,
        _keys,
        _selectedFunction=defaultSelected,
        _minLength = 1,
        _dataField = "dataField",
        _labelField = "labelField";

    _selection=d3.select(parent);

    function component() {
        _selection.each(function (data) {

            // Select the svg element, if it exists.
            var container = d3.select(this).selectAll("#bp-ac").data([data]);
            var enter = container.enter()
                    .append("div")
                    .attr("id","bp-ac")
                    .attr("class","bp-ac")
                    .append("div")
                    .attr("class","padded-row")
                    .append("div")
                    .attr("style","bp-autocomplete-holder");

            container.attr("width", __width)
                .attr("height", __height);

            var input = enter.append("input")
                        .attr("id","form")
                        .attr("class", "form-control")
                        .attr("placeholder",_placeHolder)
                        .attr("type","text")
                        .on("keyup",onKeyUp);

            var dropDown=enter.append("div").attr("class","bp-autocomplete-dropdown");

            var searching=dropDown.append("div").attr("class","bp-autocomplete-searching").text("Searching ...");

            hideSearching();
            hideDropDown();

           document.getElementById("bar_part").addEventListener('mouseleave',hide_onOut);
           document.getElementById("bar_part").addEventListener('mouseenter',show_onIn);

            function onKeyUp() {
                _searchTerm=input.node().value;
                var e=d3.event;
                 
                if  (!(e.which == 38 || e.which == 40 || e.which == 13)) {
                    
                    if (!_searchTerm || _searchTerm == "") {
                        
                        _matches=[];
                        processResults();
                        
                        showSearching("No results");
                        
                        
                    }
                    
                    else if (isNewSearchNeeded(_searchTerm,_lastSearchTerm)) {

                        _lastSearchTerm=_searchTerm;
                        _currentIndex=-1;
                        _results=[];
                        //showSearching();
                        search();
                        
                        if (_matches.length == 0) {
                            _matches=[];
                            console.log(_searchTerm)
                            processResults();
                            showSearching("No results");
                            showDropDown();
                        }
                        
                        else {
                            processResults();
                            hideSearching();
                            showDropDown();
                        }
                        
                    }

                }
                else {
                    e.preventDefault();
                }
                
            }
            
            function processResults() {

                var results=dropDown.selectAll(".bp-autocomplete-row").data(_matches, function (d) {
                    return d;});
                results.enter()
                    .append("div").attr("class","bp-autocomplete-row")
                    .on("click",function (d,i) { row_onClick(d); })
                    .append("div").attr("class","bp-autocomplete-title")
                    .html(function (d) {
                        var re = new RegExp(_searchTerm, 'i');
                        var strPart = d.match(re)[0];
                        return d.replace(re, "<span class='bp-autocomplete-highlight'>" + strPart + "</span>");
                    });

                results.exit().remove();

                //Update results

                results.select(".bp-autocomplete-title")
                    .html(function (d,i) {
                        var re = new RegExp(_searchTerm, 'i');
                        var strPart = _matches[i].match(re);
                        if (strPart) {
                            strPart = strPart[0];
                            return _matches[i].replace(re, "<span class='bp-autocomplete-highlight'>" + strPart + "</span>");
                        }

                    });


            }

            function search() {

                var str=_searchTerm;
                console.log("searching on " + _searchTerm);
                console.log("-------------------");

                if (str.length >= _minLength) {
                    _matches = [];
                    for (var i = 0; i < _keys.length; i++) {
                        var match = false;
                        
                        match = match || (_keys[i].toLowerCase().indexOf(str.toLowerCase()) >= 0) && _keys[i].toLowerCase().startsWith(str[0].toLowerCase());

                        if (match) {

                            _matches.push(_keys[i]);
                            //console.log("matches " + _keys[i][_dataField]);
                        }
                    }

                }
            }

            function row_onClick(d) {
                console.log("row click")
                hideDropDown();
                input.node().value= d;
                _selectedFunction(d);
            }

            function hide_onOut(){
                hideDropDown();
            }
            
            function show_onIn(){
                if(_searchTerm!=undefined){
                    showDropDown();
                }
                
            }
            function isNewSearchNeeded(newTerm, oldTerm) {
                return ((newTerm.length >= _minLength && newTerm != oldTerm)||(_matches.length===0));
            }

            function hideSearching() {
                searching.style("display","none");
            }

            function hideDropDown() {
                dropDown.style("display","none");
            }

            function showSearching(value) {
                searching.style("display","block");
                searching.text(value);
            }

            function showDropDown() {
                dropDown.style("display","block");
            }

        });
        
    }


    function measure() {
        _width=__width - _margin.right - _margin.left;
        _height=__height - _margin.top - _margin.bottom;
    }

    function defaultSelected(d) {
        console.log(d + " selected");
    }
    component.resetText =function (_){
       var form=  d3.selectAll("form")
       console.log(form.getAttribute())
    }

    component.render = function() {
        measure();
        component();
        return component;
    }

    component.keys = function (_) {
        if (!arguments.length) return _keys;
        _keys = _;
        return component;
    }

    component.dataField = function (_) {
        if (!arguments.length) return _dataField;
        _dataField = _;
        return component;
    }

    component.labelField = function (_) {
        if (!arguments.length) return _labelField;
        _labelField = _;
        return component;
    }

    component.margin = function(_) {
        if (!arguments.length) return _margin;
        _margin = _;
        measure();
        return component;
    };

    component.width = function(_) {
        if (!arguments.length) return __width;
        __width = _;
        measure();
        return component;
    };

    component.height = function(_) {
        if (!arguments.length) return __height;
        __height = _;
        measure();
        return component;
    };

    component.delay = function(_) {
        if (!arguments.length) return _delay;
        _delay = _;
        return component;
    };

    component.keys = function(_) {
        if (!arguments.length) return _keys;
        _keys = _;
        return component;
    };

    component.placeHolder = function(_) {
        if (!arguments.length) return _placeHolder;
        _placeHolder = _;
        return component;
    };

    component.onSelected = function(_) {
        if (!arguments.length) return _selectedFunction;
        _selectedFunction = _;
        return component;
    };



    return component;

}
