class Draggable {
    isDragged;
    mouseOffsetX;
    mouseOffsetY;
    element;
    
    constructor(e) {
        const elem = e.target;
        const position = elem.getBoundingClientRect();

        this.isDragged = true;
        this.element = this.clone(elem, position);
        this.element.addEventListener('mousedown', (ev) => this.mouseDown(ev));
        this.element.addEventListener('mouseup', () => this.mouseUp());
        this.element.addEventListener('mousemove', (ev) => this.mouseMove(ev));

        const mouseX = e.clientX;
        const mouseY = e.clientY;
        console.log(position.top, position.right, position.bottom, position.left);
        console.log(mouseX, mouseY);
        
        this.mouseOffsetX = mouseX - position.left;
        this.mouseOffsetY = mouseY - position.top;
    }

    clone(elem, pos) {
        const draggableElement = elem.cloneNode();
        draggableElement.style.position = 'absolute';
        draggableElement.style.top = pos.top+'px';
        draggableElement.style.left = pos.left+'px';
        draggableElement.style.backgroundColor = 'red';
        elem.after(draggableElement);

        return draggableElement;
    }
    
    mouseDown(e) {
        this.isDragged = true;
        const position = this.element.getBoundingClientRect();
        this.mouseOffsetX = e.clientX - position.left;
        this.mouseOffsetY = e.clientY - position.top;
        console.log('mousedown');
    }

    mouseUp() {
        this.isDragged = false;
        console.log('mouseup');
    };

    mouseMove(e) {
        if(this.isDragged) {
            let mouseX = e.clientX;
            let mouseY = e.clientY;
            let position = e.target.getBoundingClientRect();
            
            console.log('---');
            
            console.log(mouseX + '  ' + mouseY);
            console.log( this.mouseOffsetX + '  ' +  this.mouseOffsetY);
            console.log(mouseY - this.mouseOffsetY);
            console.log(mouseX - this.mouseOffsetX);
            
            $(this.element).css('top', mouseY - this.mouseOffsetY);
            $(this.element).css('left', mouseX - this.mouseOffsetX);
        }
    };
}

$('.classCard').on('mousedown', function(e) {
    new Draggable(e);
});
