import { Droppable } from "./droppable.js";

export class Draggable {
    static currentlyDragged;
    static parentOffsetX;
    static parentOffsetY;

    element;
    mouseOffsetX;
    mouseOffsetY;
    originalPosX;
    originalPosY;
    schedulePosX;
    schedulePosY;
    relativeOffsetX;
    relativeOffsetY;
    parentDroppable;
    
    constructor(e) {
        this.element = this.clone(e);
        this.element.addEventListener('mousedown', (ev) => this.mouseDown(ev));
        this.element.addEventListener('mouseup', (ev) => this.mouseUp(ev));
        Draggable.currentlyDragged = this;
        this.element.style.zIndex = 1;
        this.mouseOffsetX = e.offsetX;
        this.mouseOffsetY = e.offsetY;
        
        this.element.style.left = this.relativeOffsetX + 'px';
        this.element.style.top = this.relativeOffsetY + 'px';
        
        this.originalPosX = this.element.offsetLeft + 'px';
        this.originalPosY = this.element.offsetTop + 'px';
    }

    clone(e) {
        const elem = e.target;
        const rect = elem.parentElement.parentElement.getBoundingClientRect();
        
        Draggable.parentOffsetX = rect.left;
        Draggable.parentOffsetY = rect.top;
        this.relativeOffsetX = elem.offsetLeft;
        this.relativeOffsetY = elem.offsetTop;
        
        const draggableElement = elem.cloneNode(true);
        draggableElement.style.position = 'absolute';
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
        const draggable = Draggable.currentlyDragged;
        const rect = draggable.element.parentElement.parentElement.getBoundingClientRect();

        Draggable.parentOffsetX = rect.left;
        Draggable.parentOffsetY = rect.top;
        
        draggable.element.style.left = e.clientX - draggable.mouseOffsetX - Draggable.parentOffsetX + 'px';
        draggable.element.style.top = e.clientY - draggable.mouseOffsetY - Draggable.parentOffsetY + 'px';
    };

    dropping(elem) {
        const draggable = this;
        const rect = elem.getBoundingClientRect();
        
        this.schedulePosX = rect.left - Draggable.parentOffsetX;
        this.schedulePosY = rect.top - Draggable.parentOffsetY;
        $(this.element).animate({
            left: this.schedulePosX,
            top: this.schedulePosY
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
