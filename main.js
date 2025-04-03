class Draggable {
    is_dragged;
    element;
    
    constructor(elem) {
        this.is_dragged = true;
        this.element = this.clone(elem);
        this.element.addEventListener('mousedown', () => this.mouseDown());
        this.element.addEventListener('mouseup', () => this.mouseUp());
        this.element.addEventListener('mousemove', () => this.mouseMove());
    }

    clone(elem) {
        const rect = elem.getBoundingClientRect();
        console.log(rect.top, rect.right, rect.bottom, rect.left);
        
        const draggableElement = elem.cloneNode();
        draggableElement.style.position = 'absolute';
        draggableElement.style.top = rect.top+'px';
        draggableElement.style.left = rect.left+'px';
        draggableElement.style.backgroundColor = 'red';
        elem.after(draggableElement);
        return draggableElement;
    }
    
    mouseDown() {
        this.is_dragged = true;
        console.log('mousedown');
    }

    mouseUp() {
        this.is_dragged = false;
        console.log('mouseup');
    };
    
    mouseMove() {
        if(this.is_dragged) {
            console.log('dragged');
        }
    };
}

$('.classCard').on('mousedown', function(e) {
    new Draggable(e.target);
});
