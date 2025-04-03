import { Draggable } from "./draggable.js";

export class Droppable {
    static elements = [];

    element;

    constructor(elem) {
        this.element = elem;
        Droppable.elements.push(this.element);
    }
}
