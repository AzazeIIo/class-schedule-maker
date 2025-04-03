import { Draggable } from "./draggable.js";
import { Droppable } from "./droppable.js";

$('.classCard').on('mousedown', function(e) {
    if (e.button == 0) {
        new Draggable(e);
    }
});

$.each($('.schoolPeriod'), function (i, e) { 
    new Droppable(e);
});
