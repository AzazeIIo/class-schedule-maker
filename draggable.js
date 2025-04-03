import { Droppable } from "./droppable.js";

export class Draggable {
    isDragged;
    mouseOffsetX;
    mouseOffsetY;
    element;
    
    constructor(e) {
        this.element = this.clone(e);
        this.element.addEventListener('mousedown', (ev) => this.mouseDown(ev));
        this.element.addEventListener('mouseup', () => this.mouseUp());
        this.element.addEventListener('mousemove', (ev) => this.mouseMove(ev));
        this.isDragged = true;
        this.element.style.zIndex = 1;
        this.mouseOffsetX = e.offsetX;
        this.mouseOffsetY = e.offsetY;
    }

    clone(e) {
        const elem = e.target;
        const draggableElement = elem.cloneNode();
        const rect = elem.getBoundingClientRect();
        draggableElement.style.position = 'absolute';
        draggableElement.style.left = rect.left+'px';
        draggableElement.style.top = rect.top+'px';
        draggableElement.style.backgroundColor = 'red';
        elem.after(draggableElement);

        return draggableElement;
    }
    
    mouseDown(e) {
        this.isDragged = true;
        this.mouseOffsetX = e.offsetX;
        this.mouseOffsetY = e.offsetY;
        this.element.style.zIndex = 1;
    }

    mouseUp() {
        this.isDragged = false;
        this.element.style.zIndex = 0;

        const rect = this.element.getBoundingClientRect();
        const centerX = rect.left + this.element.offsetWidth/2;
        const centerY = rect.top + this.element.offsetHeight/2;

        const mouseElements = document.elementsFromPoint(centerX, centerY);
        
        Droppable.elements.forEach(element => {
            if(mouseElements.includes(element)) {
                console.log(element);
            }
        });
    };

    mouseMove(e) {
        if(this.isDragged) {
            $(this.element).css('left', e.clientX - this.mouseOffsetX);
            $(this.element).css('top', e.clientY - this.mouseOffsetY);
        }
    };
}
