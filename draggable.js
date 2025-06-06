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
    
    constructor(e, droppable) {
        if(droppable) {
            this.original = document.getElementById(e);
            this.element = Draggable.clone(this.original);
            this.element.addEventListener('mousedown', (ev) => this.mouseDown(ev));
            this.element.addEventListener('mouseup', (ev) => this.mouseUp(ev));
            this.parentDroppable = droppable;
            $(this.parentDroppable.element).append(this.element);
            this.element.style.width = 'calc(100% - 24px)';
            this.element.style.left = 'calc(var(--bs-gutter-x) * .5)';
            this.element.style.top = '0.8vh';
            return this.element.id;
        } else {
            if(e.button == 0 && !Draggable.animationPlaying) {
                this.original = e.target.parentElement;
                
                this.element = Draggable.clone(this.original);
                this.element.addEventListener('mousedown', (ev) => this.mouseDown(ev));
                this.element.addEventListener('mouseup', (ev) => this.mouseUp(ev));
                
                Draggable.currentlyDragged = this;
                Draggable.mouseOffsetX = e.offsetX;
                Draggable.mouseOffsetY = e.offsetY;
                
                this.element.style.left = this.original.offsetLeft + 'px';
                this.element.style.top = this.original.offsetTop + 'px';
                this.element.style.zIndex = 2;
                this.element.style.transform = 'scale(115%)';
            }
        }
    }

    static clone(target) {
        const draggableElement = target.cloneNode(true);
        draggableElement.removeAttribute("id");
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
            this.element.style.zIndex = 2;
            this.element.style.transform = 'scale(115%)';
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
            
            for(const instance of Droppable.instances) {
                if(mouseElements.includes(instance.element)) {
                    if(instance.occupied) {
                        return this.cancelling(true);
                    }
                    if(this.parentDroppable) {
                        this.parentDroppable.occupied = false;
                        this.parentDroppable.childDraggable = null;
                    }
                    this.parentDroppable = instance;
                    instance.occupied = true;
                    instance.childDraggable = this.original.id;
                    
                    return this.dropping(instance);
                }
            };
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

    dropping(droppable) {
        const draggable = this;

        const rect = droppable.element.getBoundingClientRect();
        const parentRect = draggable.element.parentElement.parentElement.getBoundingClientRect();
        this.schedulePosX = rect.left - parentRect.left;
        this.schedulePosY = rect.top - parentRect.top + ($(window).height() * 0.008);

        this.element.style.transform = 'scale(100%)';
        
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
        
        this.element.style.transform = 'scale(100%)';

        if(this.parentDroppable && insideSchedule) {
            
            $(this.element).animate({
                left: this.schedulePosX - 12,
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
                $(this.parentDroppable.element).append(this.element);
                this.element.style.width = 'calc(100% - 24px)';
                this.element.style.left = 'calc(var(--bs-gutter-x) * .5)';
                this.element.style.top = '0.8vh';
                draggable.element.style.zIndex = 1;
                Draggable.animationPlaying = false;
            });
        } else {
            if(this.parentDroppable && destroy) {
                this.parentDroppable.occupied = false;
                this.parentDroppable.childDraggable = null;
            }
            if(!destroy) {
                $(this.parentDroppable.element).append(this.element);
                this.element.style.width = 'calc(100% - 24px)';
                this.element.style.left = 'calc(var(--bs-gutter-x) * .5)';
                this.element.style.top = '0.8vh';
                draggable.element.style.zIndex = 1;
            }
            this.element.classList.add('glowRed')
            this.element.addEventListener('animationend', () => {
                if(destroy) {
                    $(this.element).remove();
                } else {
                    this.element.classList.remove('glowRed');
                }
                Draggable.animationPlaying = false;
            });
        }
    }
}
