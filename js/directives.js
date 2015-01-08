app.directive('myCell', function() {
    return {
        restrict: 'A',
        templateUrl: 'partials/cell.html',
        //controller: 'board',
        scope: false,
        //bind events for left click, right right click, and both at the same time
        link: function(scope, element, attrs) {
            //sweep cell on left click
            (function handleClick() {
                element.bind("click", function(event) {
                    scope.sweep(scope.cell);
                });
            })();
            //flag cell on right click
            (function handleRightClickFlag() {
                element.bind('contextmenu', function(event) {
                    event.preventDefault();
                    scope.flag(scope.cell);
                });
            })();
            //handle double click
            //if double click is found do a deep sweep
            //do not allow event to bubble 
            (function handleDoubleClickQuickClear() {
                var leftClick = false;
                var rightClick = false;
                element.bind('mousedown', function(event) {
                    switch (event.which) {
                        case 1:
                            leftClick = true;
                            break;
                        case 3:
                            rightClick = true;
                            break;
                    }
                });
                element.bind('mouseup', function(event) {
                    if (leftClick && rightClick) {
                        scope.quickClear(scope.cell);
                        event.stopPropagation();
                    }
                    switch (event.which) {
                        case 1:
                            leftClick = false;
                            break;
                        case 2:
                            scope.quickClear(scope.cell);
                            break;
                        case 3:
                            rightClick = false;
                            break;
                    }
                });
            })();
        }
    };
});

