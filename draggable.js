import { Droppable } from "./droppable.js";

export class Draggable {
    static currentlyDragged;

    mouseOffsetX;
    mouseOffsetY;
    originalPosX;
    originalPosY;
    schedulePosX;
    schedulePosY;
    element;
    parentDroppable;
    
    constructor(e) {
        this.element = this.clone(e);
        this.element.addEventListener('mousedown', (ev) => this.mouseDown(ev));
        this.element.addEventListener('mouseup', (ev) => this.mouseUp(ev));
        Draggable.currentlyDragged = this;
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
        elem.after(draggableElement);

        return draggableElement;
    }
    
    mouseDown(e) {
        if (e.button == 0) {
            Draggable.currentlyDragged = this;
            this.mouseOffsetX = e.offsetX;
            this.mouseOffsetY = e.offsetY;
            this.element.style.zIndex = 1;
        }
    }

    mouseUp(e) {
        if (e.button == 0) {
            const rect = this.element.getBoundingClientRect();
            const centerX = rect.left + this.element.offsetWidth/2;
            const centerY = rect.top + this.element.offsetHeight/2;

            const mouseElements = document.elementsFromPoint(centerX, centerY);
            
            for (const elem of mouseElements) {
                if(Droppable.elements.includes(elem) ) {
                    if(elem.occupied) {
                        return this.cancelling(true);
                    }
                    if(this.parentDroppable) {
                        this.parentDroppable.occupied = false;
                    }
                    this.parentDroppable = elem;
                    elem.occupied = true;
                    return this.dropping(elem);
                }
            }
            return this.cancelling(false);
        }
    };

    static mouseMove(e) {
        Draggable.currentlyDragged.element.style.left = (e.clientX - Draggable.currentlyDragged.mouseOffsetX) + 'px';
        Draggable.currentlyDragged.element.style.top = (e.clientY - Draggable.currentlyDragged.mouseOffsetY) + 'px';
    };

    dropping(elem) {
        const draggable = this;
        const rect = elem.getBoundingClientRect();
        this.schedulePosX = rect.left;
        this.schedulePosY = rect.top;
        $(this.element).animate({
            left: rect.left + 'px',
            top: rect.top + 'px'
        }, 150, "swing", function() {
            draggable.finishedAnimation(draggable, true, false);
        });
    }

    cancelling(insideSchedule) {
        const draggable = this;
        if(this.parentDroppable && insideSchedule) {
            $(this.element).animate({
                left: this.schedulePosX,
                top: this.schedulePosY
            }, 500, "swing", function() {
                draggable.finishedAnimation(draggable, false, false);
            });
        } else {
            $(this.element).animate({
                left: this.originalPosX,
                top: this.originalPosY
            }, 500, "swing", function() {
                draggable.finishedAnimation(draggable, false, true);
            });
        }
    }

    finishedAnimation(draggable, success, destroy) {
        Draggable.currentlyDragged = null;
        if(success) {
            this.element.classList.add('glowGreen')
            this.element.addEventListener('animationend', () => {
                this.element.classList.remove('glowGreen')
                draggable.element.style.zIndex = 0;
            });
        } else {
            if(this.parentDroppable && destroy) {
                this.parentDroppable.occupied = false;
            }
            this.element.classList.add('glowRed')
            this.element.addEventListener('animationend', () => {
                if(destroy) {
                    $(this.element).remove();
                } else {
                    this.element.classList.remove('glowRed');
                    draggable.element.style.zIndex = 0;
                }
            });
        }
    }
}
