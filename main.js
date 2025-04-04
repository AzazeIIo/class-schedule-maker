import { Draggable } from "./draggable.js";
import { Droppable } from "./droppable.js";

$(document).ready( function() {
    $(this).on('mousemove', function(e) {
        if(Draggable.currentlyDragged) {
            Draggable.mouseMove(e);
        }
    });
});

$('.classCard').on('mousedown', function(e) {
    if (e.button == 0) {
        new Draggable(e);
    }
});

$.each($('.schoolPeriod'), function (i, e) { 
    new Droppable(e);
});
