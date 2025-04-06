import { Draggable } from "./draggable.js";
import { Droppable } from "./droppable.js";

const saveToast = document.getElementById('saveToast');
const deleteToast = document.getElementById('deleteToast');

$(document).ready( function() {
    $(this).on('mousemove', function(e) {
        Draggable.mouseMove(e);
    });

    $.each($('.schoolPeriod'), function (i, e) { 
        const droppable = new Droppable(e);
        if(localStorage.getItem('schedule')) {
            const id = JSON.parse(localStorage.getItem('schedule'))[i];
            droppable.set(id);
        }
    });
});

$('.classCard').on('mousedown', function(e) {
    new Draggable(e);
});

$('#saveBtn').on('click', function() {
    Droppable.save();
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(saveToast);
    toastBootstrap.show();
});

$('#deleteBtn').on('click', function() {
    Droppable.delete();
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(deleteToast);
    toastBootstrap.show();
});
