import { Project } from './project.model';
import Vector from './vector';

export default class Node {
    data: Project;
    RING_RADIUS = 265;
    MAX_LINK_LENGTH = 290;
    MOUSE_HOVER_DIST = 120;
    CLICKABLE_RADIUS_ADD = 0;
    IDLE_DRAG = 0.02;
    ACTIVE_DRAG = 0.5;
    ACTIVE_RADIUS = 175;
    STROKE_WIDTH = 10;
    IDLE_RADIUS: number;
    active: boolean;
    emptyVector: Vector;
    hoverState: number;
    fadeCount: number;
    start: Date;
    age: number;
    pos: Vector;
    vel: Vector;
    acc: Vector;
    center: Vector;
    radius: number;
    link: Node;
    linkStartTime: Date;
    thumbImg: HTMLImageElement;

    constructor(data: Project) {
        this.data = data;
        const startAngle = Math.random() * Math.PI * 2;
        const startRadius = Math.random() * 20;
        const fallbackImg = 'https://app.pizzasparta.ca/en/favicon.ico';

        if (!this.data.lame && !this.data.small) {
            this.IDLE_RADIUS = 30;
        } else if (!this.data.lame && !this.active && this.data.small) {
            this.IDLE_RADIUS = 7;
            this.STROKE_WIDTH = 6;
        } else {
            this.STROKE_WIDTH = 5 - Math.floor(Math.random() * (3 - 0 + 1)) + 0;
            this.IDLE_RADIUS = 25 - (Math.floor(Math.random() * (22 - 17 + 1)) + 17);
        }

        this.emptyVector = new Vector(0, 0, 0);
        this.hoverState = 0;
        this.fadeCount = 0;
        this.start = new Date();
        this.age = 0;
        this.pos = new Vector(Math.cos(startAngle), Math.sin(startAngle), 0);
        this.pos = this.pos.mult(startRadius);
        this.vel = new Vector(0, 0, 0);
        this.acc = new Vector(0, 0, 0);
        this.radius = this.IDLE_RADIUS;
        this.center = new Vector(0, 0, 0);
        this.active = false;
        this.thumbImg = document.createElement('img');

        if (this.data.iconUrlSmall && !this.data.lame) {
            this.thumbImg.src = this.data.iconUrlSmall;
        } else if (this.data.startsWith) {
            this.thumbImg.src = fallbackImg;
        }

        this.thumbImg.addEventListener('error', () => {
            this.thumbImg.src = fallbackImg;
        });
    }

    getAge = () => {
        return new Date().getTime() - this.start.getTime();
    };

    applyForces() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc = new Vector(0, 0, 0);
    }

    update(hovered) {
        if (this.active) {
            this.STROKE_WIDTH = 10;
        } else if (!this.data.lame && this.data.small) {
            this.STROKE_WIDTH = 6;
        }

        this.age += 1;
        this.applyForces();
        this.updateLerps();
        this.drag(this.active ? this.ACTIVE_DRAG : this.IDLE_DRAG);

        if (!this.active) {
            if (!hovered) {
                this.jitter(0.15);
                this.keepInRing(this.RING_RADIUS, 0.00007);
                this.rotate(0.002);
            }
        } else {
            this.moveToCenter();
        }

        this.updateLink();
    }

    moveToCenter() {
        this.pos.mult(0.85).add(this.center.mult(0.15));
    }

    updateMousePos(mousePos) {
        if (!mousePos || this.data.lame) {
            return;
        }
        let diff = this.pos.copy().sub(mousePos);

        this.hoverState = Math.max((this.MOUSE_HOVER_DIST - diff.mag()) / this.MOUSE_HOVER_DIST, 0);
        this.hoverState *= Math.max(0, Math.min(1, (this.getAge() - 1000) / 5000));
    }

    updateLerps() {
        const targetRadius = this.active ? this.ACTIVE_RADIUS : this.IDLE_RADIUS;
        this.radius = targetRadius * 0.1 + this.radius * 0.9;
    }

    hitTest(x, y) {
        return (
            new Vector(x, y, 0).sub(this.pos).mag() <
            this.getDisplayRadius() + this.CLICKABLE_RADIUS_ADD
        );
    }

    onClick() {
        if (this.active) {
            this.deactivate();
        } else {
            this.activate();
        }
    }

    activate() {
        if (!this.data.lame) {
            this.active = true;
        }
    }

    deactivate() {
        this.active = false;
    }

    getDisplayRadius() {
        let r = this.radius;
        if (!this.active && !this.data.lame) {
            if (this.data.small) {
                r += (this.hoverState || 0) * 26;
            } else {
                r += (this.hoverState || 0) * 10;
            }
        }
        return r;
    }

    keepInRing(radius, amt) {
        const diff = this.pos.copy();
        const mag = diff.mag();
        const force = amt * (radius - mag);
        // avoid divide by zero. #jitter() should take care of moving it off the
        // origin
        if (mag != 0) {
            diff.normalize().mult(force);
        }
        if (mag < 80) {
            diff.mult(10); // push out faster from center on load
        }
        this.acc.add(diff);
    }

    jitter(amt) {
        let force = new Vector(Math.random() - 0.5, Math.random() - 0.5, 0);
        force.mult(amt);
        this.acc.add(force);
    }

    drag(amt) {
        this.vel.mult(1 - amt);
    }

    rotate(amt) {
        let force = this.pos.copy();
        [force.x, force.y] = [-force.y, force.x];
        force.mult(amt);
        this.pos.add(force);
    }

    render(ctx) {
        const r = this.getDisplayRadius();
        const alpha = this.data.small && !this.data.focus ? 0.65 : 0.5;

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, r, 0, Math.PI * 2, true);
        ctx.fillStyle = this.data.lame
            ? '#ececec'
            : 'rgba(' +
              this.data.RGB.r +
              ',' +
              this.data.RGB.g +
              ',' +
              this.data.RGB.b +
              ',' +
              alpha +
              ')';

        ctx.fill();
        this.renderWhiteFill(ctx);

        if (!this.data.small || this.active || this.data.lame || this.data.focus) {
            // Wait a tick before drawing the logo
            if (!this.active && !this.data.lame && this.fadeCount >= 0.5) {
                this.renderLogo(ctx);
            }
        }
        ctx.closePath();
        ctx.restore();
    }

    renderWhiteFill(ctx) {
        let r = this.getDisplayRadius();
        r = this.getDisplayRadius() > this.STROKE_WIDTH / 2 ? r - this.STROKE_WIDTH / 2 : r;

        ctx.globalAlpha = this.active ? 1 : this.fadeCount;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, r, 0, Math.PI * 2, true);
        ctx.fillStyle = 'white';
        ctx.fill();

        if (this.fadeCount < 1) {
            this.fadeCount += 0.05;
        }
    }

    renderLogo(ctx) {
        const logoSize = this.getDisplayRadius() / 1.05;
        const logoPos = {
            x: this.pos.x - logoSize / 2,
            y: this.pos.y - logoSize / 2
        };

        ctx.globalAlpha = this.fadeCount <= 0.9 ? this.fadeCount : 0.9;
        ctx.drawImage(this.thumbImg, logoPos.x, logoPos.y, logoSize, logoSize);

        // Colorize fallback logo on non-IE browsers
        if (
            typeof this.data.iconUrlSmall == 'undefined' &&
            navigator.userAgent.indexOf('MSIE') == -1
        ) {
            ctx.globalCompositeOperation = 'lighten';
            ctx.fillStyle = this.data.fallbackColor;
            ctx.fillRect(logoPos.x, logoPos.y, logoSize, logoSize);
        }
    }

    getLineStart() {
        return new Vector(this.pos.x, this.pos.y, 0);
    }

    getLineEnd() {
        return new Vector(this.link.pos.x, this.link.pos.y, 0);
    }

    getDotAlpha() {
        return Math.min(1, this.age / 10);
    }

    getLinkAlpha() {
        const distance = this.pos.copy().sub(this.link.pos).mag();
        return Math.max(0, (this.MAX_LINK_LENGTH - distance) / this.MAX_LINK_LENGTH);
    }

    renderLink(ctx: CanvasRenderingContext2D) {
        if (this.link != null && !this.data.lame) {
            ctx.save();
            ctx.beginPath();
            this.doLinkPath(ctx);
            ctx.strokeStyle = '#ececec';
            ctx.globalAlpha = this.getLinkAlpha();
            ctx.lineWidth = this.STROKE_WIDTH - 8;
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
    }

    doLinkPath(ctx) {
        const start = this.getLineStart();
        const end = this.getLineEnd();

        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
    }

    updateLink() {
        let ref;
        if (
            ((ref = this.link) != null ? ref.pos.copy().sub(this.pos).mag() : void 0) >
            this.MAX_LINK_LENGTH
        ) {
            this.killLink();
        }
    }

    linkTo(node: Node) {
        if (!node.data.lame) {
            this.linkStartTime = new Date();
            this.link = node;
        }
    }

    killLink() {
        this.link = null;
    }
}
