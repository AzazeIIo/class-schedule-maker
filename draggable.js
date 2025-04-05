import { Droppable } from "./droppable.js";

export class Draggable {
    static currentlyDragged;
    static mouseOffsetX;
    static mouseOffsetY;
    static animationPlaying = false;
    
    element;
    original;
    schedulePosX;
    schedulePosY;
    relativeOffsetX;
    relativeOffsetY;
    parentDroppable;
    
    constructor(e) {
        if(e.button == 0 && !Draggable.animationPlaying) {
            this.original = e.target;

            this.element = this.clone(this.original);
            this.element.addEventListener('mousedown', (ev) => this.mouseDown(ev));
            this.element.addEventListener('mouseup', (ev) => this.mouseUp(ev));

            Draggable.currentlyDragged = this;
            Draggable.mouseOffsetX = e.offsetX;
            Draggable.mouseOffsetY = e.offsetY;

            this.element.style.left = this.original.offsetLeft + 'px';
            this.element.style.top = this.original.offsetTop + 'px';
            this.element.style.zIndex = 1;
        }
    }

    clone(target) {
        const draggableElement = target.cloneNode(true);
        draggableElement.style.position = 'absolute';
        target.after(draggableElement);

        return draggableElement;
    }
    
    mouseDown(e) {
        if (e.button == 0 && !Draggable.animationPlaying) {
            Draggable.currentlyDragged = this;
            Draggable.mouseOffsetX = e.offsetX;
            Draggable.mouseOffsetY = e.offsetY;

            const rect = this.element.getBoundingClientRect();
            const parentRect = this.original.parentElement.parentElement.getBoundingClientRect();
            this.schedulePosX = rect.left - parentRect.left;
            this.schedulePosY = rect.top - parentRect.top;

            $(this.original.parentElement).append(this.element);
            this.element.style.left = this.schedulePosX + 'px';
            this.element.style.top = this.schedulePosY + 'px';
            this.element.style.width = '16.66666667%';
            this.element.style.zIndex = 1;
        } else if (e.button == 2 && Draggable.currentlyDragged) {
            Draggable.currentlyDragged.cancelling(false);
        }
    }

    mouseUp(e) {
        if (e.button == 0 && Draggable.currentlyDragged != null) {
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
        if(Draggable.currentlyDragged) {
            const draggable = Draggable.currentlyDragged;

            if(e.clientX > document.body.clientWidth || e.clientY > document.body.clientHeight) {
                return draggable.cancelling(draggable.parentDroppable != null);
            }

            const rect = draggable.element.parentElement.parentElement.getBoundingClientRect();
            const parentOffsetX = rect.left;
            const parentOffsetY = rect.top;
            
            draggable.element.style.left = e.clientX - Draggable.mouseOffsetX - parentOffsetX + 'px';
            draggable.element.style.top = e.clientY - Draggable.mouseOffsetY - parentOffsetY + 'px';
        }
    };

    dropping(elem) {
        const draggable = this;

        const rect = elem.getBoundingClientRect();
        const parentRect = draggable.element.parentElement.parentElement.getBoundingClientRect();
        this.schedulePosX = rect.left - parentRect.left;
        this.schedulePosY = rect.top - parentRect.top;
        
        Draggable.currentlyDragged = null;
        Draggable.animationPlaying = true;

        $(this.element).animate({
            left: this.schedulePosX,
            top: this.schedulePosY
        }, 150, "swing", function() {
            draggable.finishedAnimation(draggable, true, false);
        });
    }

    cancelling(insideSchedule) {
        const draggable = this;
        
        Draggable.currentlyDragged = null;
        Draggable.animationPlaying = true;

        if(this.parentDroppable && insideSchedule) {
            $(this.element).animate({
                left: this.schedulePosX,
                top: this.schedulePosY
            }, 500, "swing", function() {
                draggable.finishedAnimation(draggable, false, false);
            });
        } else {
            $(this.element).animate({
                left: this.original.offsetLeft,
                top: this.original.offsetTop
            }, 500, "swing", function() {
                draggable.finishedAnimation(draggable, false, true);
            });
        }
    }

    finishedAnimation(draggable, success, destroy) {
        if(success) {
            this.element.classList.add('glowGreen')
            this.element.addEventListener('animationend', () => {
                this.element.classList.remove('glowGreen')
                $(this.parentDroppable).append(this.element);
                this.element.style.width = '100%';
                this.element.style.left = 0;
                this.element.style.top = 0;
                draggable.element.style.zIndex = 0;
                Draggable.animationPlaying = false;
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
                    $(this.parentDroppable).append(this.element);
                    this.element.style.width = '100%';
                    this.element.style.left = 0;
                    this.element.style.top = 0;
                    draggable.element.style.zIndex = 0;
                }
                Draggable.animationPlaying = false;
            });
        }
    }
}
