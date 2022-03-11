window.onload = function() {
    var canvas = document.getElementById('canvas');
    var clearButton = document.getElementById('clear');
    var dragging = false;
    var dragStartLocation = null;
    var dragEndLocation = null;
    var context = canvas.getContext('2d');
    var dataPool = [];
    var flag = false;
    var triangleIndex = 0;
    var randomColor = null;
    var location = {
        x: 0,
        y: 0
};

canvas.addEventListener('doubleclick', function(e) {

var position = getMousePositions(canvas, e);
    dataPool.forEach(function (value) {

        var A0 = findArea(value[0][0], value[0][1], value[1][0], value[1][1], value[2][0], value[2][1]);
        var A1 = findArea(value[0][0], value[0][1], position.x, position.y, value[2][0], value[2][1]);
        var A2 = findArea(value[0][0], value[0][1], value[1][0], value[1][1], position.x, position.y);
        var A3 = findArea(position.x, position.y, value[1][0], value[1][1], value[2][0], value[2][1]);

    if (Math.round(A0) === Math.round(A1 + A2 + A3)) {
        var newList = [];
        var item = dataPool[dataPool.indexOf(value)];
    dataPool.forEach(function (value2) {

        if (value2 !== item) {
        newList.push(value2);
        }
        });

    dataPool = newList;
    clearCanvas();
    dataPool.forEach(function (value2) {
        reDrawTriangles(value2[0][0], value2[0][1], value2[4], value2[3]);
        });

    return true;
    }
    });

    dragging = false;
});

canvas.addEventListener('mousedown', function(e) {

    canvas.style.cursor = 'move';
    e.preventDefault();
    var mousePosition = getMousePositions(canvas, e);
    dragStartLocation = mousePosition;
    dragEnd = mousePosition;
    dragging = true;
    flag = checkIfInside(mousePosition);
    dragStartLocation = mousePosition;
    dragEndLocation = mousePosition;
    randomColor = getRandomColor();

    if(dataPool.length > 0) {
        location.x = dataPool[triangleIndex][0][0] - mousePosition.x;
        location.y = dataPool[triangleIndex][0][1] - mousePosition.y;
        }
    console.log(location);
});

canvas.addEventListener('mousemove', function(e) {
    dragEndLocation = getMousePositions(canvas, e);
    if(dragging && flag) {
        clearCanvas();
        canvas.style.cursor = 'ne-resize';
        reDrawTriangles(dragStartLocation.x, dragStartLocation.y, calculateLineDistance(dragStartLocation.x, dragStartLocation.y, dragEndLocation.x, dragEndLocation.y), randomColor);
        dataPool.forEach(function (value) {
            reDrawTriangles(value[0][0], value[0][1], value[4], value[3]);
        });
    }

    else if(dragging) {
        canvas.style.cursor = 'crosshair';
        clearCanvas();
        var item = dataPool[triangleIndex];
        var differX = dragEndLocation.x - item[0][0] + location.x;
        var differY = dragEndLocation.y - item[0][1] + location.y;
        item[0][0] += differX;
        item[0][1] += differY;
        item[1][0] += differX;
        item[1][1] += differY;
        item[2][0] += differX;
        item[2][1] += differY;
        reDrawTriangles(item[0][0], item[0][1], item[4], item[3]);
        dataPool.forEach(function (value) {

            if(value[0][0] !== dragStartLocation.x && value[0][1] !== dragStartLocation.y) {
                reDrawTriangles(value[0][0], value[0][1], value[4], value[3]);
            }
        });
    }
}, true);


canvas.addEventListener('mouseup', function(e) {
    canvas.style.cursor = 'pointer';
    var mousePosition = getMousePositions(canvas, e);

    if(!flag) {
        dragging = false;
        flag = false;
        doDragTranslation(mousePosition.x, mousePosition.y);
    }

    else if(dragging && calculateLineDistance(dragStartLocation.x, dragStartLocation.y, dragEndLocation.x, dragEndLocation.y) > 2) {
        dragging = false;
        flag = false;
        dragEndLocation = mousePosition;
        drawTriangle(1, dragStartLocation.x, dragStartLocation.y, dragEndLocation.x, dragEndLocation.y);
    }
});


clearButton.addEventListener('click', function() {
    dataPool = [];
    clearCanvas();
});

function checkIfInside(position) {

    flag = true;
    dataPool.forEach(function (value) {
        var A0 = findArea(value[0][0], value[0][1], value[1][0], value[1][1], value[2][0], value[2][1]);
        var A1 = findArea(value[0][0], value[0][1], position.x, position.y, value[2][0], value[2][1]);
        var A2 = findArea(value[0][0], value[0][1], value[1][0], value[1][1], position.x, position.y);
        var A3 = findArea(position.x, position.y, value[1][0], value[1][1], value[2][0], value[2][1]);
                
        if (Math.round(A0) === Math.round(A1 + A2 + A3)) {
            triangleIndex = dataPool.indexOf(value);
            flag = false;
            return true;
        }
    });
        return flag;
}

function findArea(x1, y1, x2, y2, x3, y3) {
    
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
}

function doDragTranslation(newx, newy) {

    var item = dataPool[triIndex];
    var difX = newx - item[0][0] + location.x;
    var difY = newy - item[0][1] + location.y;
    item[0][0] += difX;
    item[0][1] += difY;
    item[1][0] += difX;
    item[1][1] += difY;
    item[2][0] += difX;
    item[2][1] += difY;
    dataPool.splice(triangleIndex, 0, item);
    clearCanvas();
    dataPool.forEach(function (value) {
        reDrawTriangles(value[0][0], value[0][1], value[4], value[3]);
    });
}


function getMousePositions(canvas, e) {

    var bounds = canvas.getBoundingClientRect();
    return {

        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top

    };
}

function calculateLineDistance(x1, y1, x2, y2) {

    return Math.round(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
}

function drawTriangle(mode, x1, y1, x2, y2) {

    
    var distance = calculateLineDistance(x1, y1, x2, y2);
    
    var height = 1.414 * (distance) * mode;
    
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x1 + distance / 2, y1 + height);
    context.lineTo(x1 - distance / 2, y1 + height);
    context.moveTo(x1, y1);
    context.fillStyle = randomColor;
    context.fill();
    context.stroke();
        
    dataPool.push([[x1, y1], [x1 + distance / 2, y1 + height * 1.25], [x1 - distance / 2, y1 + height * 1.25], [context.fillStyle], [distance]]);

}

function reDrawTriangles(x1, y1, distance, color) {

    
    var height = 1.414 * (distance);
    
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x1 + distance / 2, y1 + height);
    context.lineTo(x1 - distance / 2, y1 + height);
    context.moveTo(x1, y1);
    context.fillStyle = color;
    context.fill();
    context.stroke();

}

function getRandomColor() {
    var r = Math.ceil(Math.random() * 256);
    var g = Math.ceil(Math.random() * 256);
    var b = Math.ceil(Math.random() * 256);
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

};