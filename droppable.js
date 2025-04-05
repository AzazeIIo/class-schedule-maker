import { Draggable } from "./draggable.js";

export class Droppable {
    static instances = [];

    element;
    occupied;
    childDraggable;

    constructor(elem) {
        this.element = elem;
        this.occupied = false;
        this.childDraggable = null;
        Droppable.instances.push(this);
    }

    set(id) {
        console.log(id);
        
    }

    static save() {
        const draggables = [];

        Droppable.instances.forEach(instance => {
            draggables.push(instance.childDraggable);
        });

        localStorage.setItem("schedule", JSON.stringify(draggables));
    }
}
