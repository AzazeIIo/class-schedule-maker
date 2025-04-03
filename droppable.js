import { Draggable } from "./draggable.js";

export class Droppable {
    static elements = [];

    element;
    occupied;

    constructor(elem) {
        this.element = elem;
        this.occupied = false;
        Droppable.elements.push(this.element);
    }
}
