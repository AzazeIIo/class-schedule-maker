import { Draggable } from "./draggable.js";
import { Droppable } from "./droppable.js";

$(document).ready( function() {
    $(this).on('mousemove', function(e) {
        Draggable.mouseMove(e);
    });
});

$('.classCard').on('mousedown', function(e) {
    new Draggable(e);
});

$.each($('.schoolPeriod'), function (i, e) { 
    new Droppable(e);
});

$('#saveBtn').on('click', function() {
    console.log('saving');
    
});

$('#resetBtn').on('click', function() {
    console.log('resetting');
    
});
