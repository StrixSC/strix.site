import Project from './project.model';
import p5Types from 'p5';

const GROWTH_FACTOR = 2.5;
const MAX_NEAR_RADIUS = 35;
const MAX_RADIUS = 60;
export default class Bubble {
    project: Project;
    p5: p5Types;
    com: p5Types.Vector;
    direction: p5Types.Vector;
    radius: number;
    baseRadius: number;
    angle: number;
    state: 'GROWING' | 'GROWING_NEAR' | 'SHRINKING' | 'MAXED' | 'MAXED_NEAR' | 'BASED';
    isHovered: boolean;
    scaleVal: number = 3;
    imageRef: p5Types.Element;
    image: p5Types.Image;
    imageWidth: number;
    imageHeight: number;
    multiplier_hovered: number = 4;
    multiplier_near: number = 3;
    imagePosition: p5Types.Vector;

    constructor(project: Project, p5: p5Types, com: p5Types.Vector, radius: number) {
        this.p5 = p5;
        this.project = project;
        this.com = com;
        this.angle = p5.random(0.25, 2) / 10;
        this.radius = radius;
        this.baseRadius = radius;
        this.state = 'BASED';
        this.imageWidth = this.radius;
        this.imageHeight = this.radius;
        this.imagePosition = p5.createVector(this.com.x, this.com.y);
        try {
            this.imageRef = p5.createImg(project.image, project.title, (image: p5Types.Image) => {
                this.image = image;
            });
            this.imageRef.hide();
        } catch (e) {
            // todo
        }
    }

    rotate(): void {
        this.com.rotate(this.angle);
        this.imagePosition.rotate(this.angle);
    }

    render(): void {
        this.p5.stroke(
            this.project.bcolor.R,
            this.project.bcolor.G,
            this.project.bcolor.B,
            this.project.bcolor.A
        );

        if (this.state === 'GROWING') {
            this.radius = this.p5.constrain(
                this.radius + GROWTH_FACTOR,
                this.baseRadius,
                MAX_RADIUS
            );
            if (this.radius === MAX_RADIUS) {
                this.state = 'MAXED';
            }
        } else if (this.state === 'SHRINKING') {
            this.radius = this.p5.constrain(
                this.radius - GROWTH_FACTOR,
                this.baseRadius,
                MAX_RADIUS
            );
            if (this.radius === this.baseRadius) {
                this.state = 'BASED';
            }
        } else if (this.state === 'GROWING_NEAR') {
            this.radius = this.p5.constrain(
                this.radius + GROWTH_FACTOR,
                this.baseRadius,
                MAX_NEAR_RADIUS
            );
            if (this.radius === MAX_NEAR_RADIUS) {
                this.state = 'MAXED_NEAR';
            }
        }

        this.p5.strokeWeight(5);
        this.p5.circle(this.com.x, this.com.y, this.radius);
        if (this.state === 'MAXED' || (this.state === 'GROWING' && this.radius >= MAX_RADIUS / 2)) {
            let imageWidth = this.radius - 20;
            this.p5.image(
                this.image,
                this.imagePosition.x - imageWidth / 2,
                this.imagePosition.y - imageWidth / 2,
                imageWidth,
                imageWidth
            );
        }
    }

    onClick(): void {}
}
