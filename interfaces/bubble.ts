import Project from './project.model';
import p5Types from 'p5';

export default class Bubble {
    project: Project;
    p5: p5Types;
    com: p5Types.Vector;
    direction: p5Types.Vector;
    radius: number;
    angle: number;
    isHovered: boolean;
    scaleVal: number = 3;

    constructor(project: Project, p5: p5Types, com: p5Types.Vector, radius: number) {
        this.p5 = p5;
        this.project = project;
        this.com = com;
        this.angle = p5.random(0.25, 2) / 10;
        this.radius = radius;
        console.log(this.project.bcolor, this.com);
    }

    rotate(): void {
        this.com.rotate(this.angle);
    }

    render(): void {
        this.p5.stroke(
            this.project.bcolor.R,
            this.project.bcolor.G,
            this.project.bcolor.B,
            this.project.bcolor.A
        );
        this.p5.strokeWeight(2);
        this.p5.circle(this.com.x, this.com.y, 2 * this.radius);
    }

    onClick(): void {}

    onHover(): void {
        if (!this.isHovered) {
            this.isHovered = true;
            this.radius *= this.scaleVal;
        }
    }

    onHoverOff(): void {
        if (this.isHovered) {
            this.radius /= this.scaleVal;
            this.isHovered = false;
        }
    }
}
