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
        if(id != null) {
            new Draggable(String(id), this);
            this.childDraggable = id;
        }
    }

    static save() {
        const draggables = [];

        Droppable.instances.forEach(instance => {
            draggables.push(instance.childDraggable);
        });

        localStorage.setItem("schedule", JSON.stringify(draggables));
    }
}
