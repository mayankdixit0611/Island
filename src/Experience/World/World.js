import Experience from '../Experience.js';
import Environment from './Environment.js';
import Island from './Island.js';

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.island = new Island()
            this.environment = new Environment()
        })
    }

    update()
    {
        if(this.island)
            this.island.update()
    }
    
    click() 
    {
        if(this.island)
            this.island.click()
    }
}