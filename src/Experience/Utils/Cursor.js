import EventEmitter from './EventEmitter.js'

export default class Cursor extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.x = 0;
        this.y = 0;

        // cursor movement event
        window.addEventListener('mousemove', (event) => {
            this.x = event.clientX 
            this.y = event.clientY
            this.trigger('cursor_movement')
        })

        // click event
        window.addEventListener('click', () => {
            this.trigger('click');
        })
    }
}