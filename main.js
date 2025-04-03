import { Draggable } from "./draggable.js";
import { Droppable } from "./droppable.js";

$('.classCard').on('mousedown', function(e) {
    new Draggable(e);
});
