import { Droppable } from "./droppable.js";

export class Draggable {
    isDragged;
    mouseOffsetX;
    mouseOffsetY;
    originalPosX;
    originalPosY;
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
        this.originalPosX = this.element.style.left;
        this.originalPosY = this.element.style.top;
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
        if (e.button == 0) {
            this.isDragged = true;
            this.mouseOffsetX = e.offsetX;
            this.mouseOffsetY = e.offsetY;
            this.originalPosX = this.element.style.left;
            this.originalPosY = this.element.style.top;
            this.element.style.zIndex = 1;
        }
    }

    mouseUp() {
        const rect = this.element.getBoundingClientRect();
        const centerX = rect.left + this.element.offsetWidth/2;
        const centerY = rect.top + this.element.offsetHeight/2;

        const mouseElements = document.elementsFromPoint(centerX, centerY);
        
        for (const elem of mouseElements) {
            if(Droppable.elements.includes(elem)) {
                return this.dropping(elem);
            }
        }
        return this.cancelling();
    };

    mouseMove(e) {
        if(this.isDragged) {
            this.element.style.left = (e.clientX - this.mouseOffsetX) + 'px';
            this.element.style.top = (e.clientY - this.mouseOffsetY) + 'px';
            console.log(this.originalPosX);
            
        }
    };

    dropping(elem) {
        const draggable = this;
        const rect = elem.getBoundingClientRect();
        $(this.element).animate({
            left: rect.left + 'px',
            top: rect.top + 'px'
        }, 150, "swing", function() {draggable.finishedAnimation(draggable);});
    }

    cancelling() {
        const draggable = this;
        $(this.element).animate({
            left: this.originalPosX,
            top: this.originalPosY
        }, 500, "swing", function() {draggable.finishedAnimation(draggable);});
    }

    finishedAnimation(draggable) {
        console.log(draggable);
        draggable.isDragged = false;
        draggable.element.style.zIndex = 0;
        console.log('finished');
    }
}
