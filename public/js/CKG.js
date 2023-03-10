/* eslint-disable */
/// <reference path="./public/js/jquery-3.6.3.min.js" />

const canvasContainer = $('.canvas-container');
const selectedProject = $('.selected-project');
const projectTitle = $('.project-title');
const projectButton = $('.project-button');
const projectDescription = $('.project-description');
const projectSummary = $('.project-summary');
const projectLogo = $('.project-logo');

const config_service = {
    API_BASE_URL: '',
    API_KEY: '',
    PROJECT_ID: '',
    ENABLE_ERROR_REPORTING: true,
    LIST_PAGE_SIZE: 48,
    EXPLORE_PAGE_SIZE: 80,
    MOBILE_WIDTH: 720,
    COLORS: {
        GREEN: '#34A853',
        RED: '#EA4335',
        BLUE: '#4285F4',
        YELLOW: '#FBBC05'
    },
    SORT_PARAMS: ['Relevance', 'Name'],
    LANGUAGES: [
        'c',
        'c#',
        'c++',
        'css',
        'dart',
        'go',
        'haskell',
        'java',
        'javascript',
        'lua',
        'objective-c',
        'perl',
        'php',
        'python',
        'r',
        'ruby',
        'rust',
        'shell',
        'swift',
        'typescript'
    ],
    CATEGORIES: [
        {
            slug: 'featured',
            cat: 'Featured'
        },
        {
            slug: 'cloud',
            cat: 'Cloud'
        },
        {
            slug: 'analytics-visualization',
            cat: 'Data Analytics & Visualization'
        },
        {
            slug: 'databases',
            cat: 'Databases'
        },
        {
            slug: 'developer-tools',
            cat: 'Developer Tools'
        },
        {
            slug: 'education',
            cat: 'Education & Science'
        },
        {
            slug: 'enterprise',
            cat: 'Enterprise'
        },
        {
            slug: 'games',
            cat: 'Games & Entertainment'
        },
        {
            slug: 'graphics-video-audio',
            cat: 'Graphics, Video, & Audio'
        },
        {
            slug: 'i18n',
            cat: 'Internationalization & Localization'
        },
        {
            slug: 'iot',
            cat: 'Internet of Things'
        },
        {
            slug: 'geo',
            cat: 'Location & Maps'
        },
        {
            slug: 'machine-learning',
            cat: 'Machine Learning, Neural Networks, & AI'
        },
        {
            slug: 'mobile',
            cat: 'Mobile'
        },
        {
            slug: 'networking',
            cat: 'Networking'
        },
        {
            slug: 'programming',
            cat: 'Programming'
        },
        {
            slug: 'samples',
            cat: 'Samples & Examples'
        },
        {
            slug: 'security',
            cat: 'Security'
        },
        {
            slug: 'testing',
            cat: 'Testing'
        },
        {
            slug: 'utilities',
            cat: 'Utilities'
        },
        {
            slug: 'web',
            cat: 'Web'
        }
    ]
};

const deeplinkService = {
    query: null,
    currentPage: 'explore'
};

/* eslint-disable */
class UtilsService {
    /**
     * Reads user agent string and returns one of 6 possible vendors.
     * @returns A string containg the browser; `Opera`, `Chrome`, `Safari`,
     * `Firefox`, `IE`, or `Unknown`.
     */
    getBrowserVendor() {
        const UA = navigator.userAgent;
        let vendor;

        if ((UA.indexOf('Opera') || UA.indexOf('OPR')) != -1) {
            vendor = 'Opera';
        } else if (UA.indexOf('Chrome') != -1) {
            vendor = 'Chrome';
        } else if (UA.indexOf('Safari') != -1) {
            vendor = 'Safari';
        } else if (UA.indexOf('Firefox') != -1) {
            vendor = 'Firefox';
        } else if (UA.indexOf('MSIE') != -1) {
            vendor = 'IE';
        } else {
            vendor = 'Unknown';
        }

        return vendor;
    }

    /*
     * Some browsers don't support the fancy features needed by the project
     * explore view well.  Detect them here.
     */
    supportsExploreView() {
        const UA = navigator.userAgent;

        // IE11 has issues with transparency on the circle viz.
        if (UA.indexOf('Trident') != -1 && UA.indexOf('rv:11') != -1) {
            return false;
        }

        return true;
    }

    /**
     * Modulo function
     * @param a  dividend
     * @param b  divisor
     * @returns Remainder of quotient a / b.
     */
    modulo(a, b) {
        return ((+a % (b = +b)) + b) % b;
    }

    /**
     * Extracts RGB values from hex color.
     * @param hex  hexadecimal string to be examined.
     * @returns  Object containing R, G, G values on scale of 250.
     */
    hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16)
              }
            : null;
    }
}

/**
 * Vector math helper class for 2d animation.
 */
class Vector {
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    copy() {
        return new Vector(this.x, this.y, this.z);
    }

    mag() {
        return Math.sqrt(this.magSq());
    }

    magSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    normalize() {
        this.div(this.mag());
        return this;
    }

    add(p) {
        this.x += p.x;
        this.y += p.y;
        this.z += p.z;
        return this;
    }

    sub(p) {
        this.x -= p.x;
        this.y -= p.y;
        this.z -= p.z;
        return this;
    }

    mult(n) {
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }

    div(n) {
        this.x /= n;
        this.y /= n;
        this.z /= n;
        return this;
    }
}

/**
 * Animation class for the individual projects displayed by the explore canvas
 * view.  (
 *
 * This controls the "particle physics simulation" of the small circles,
 * attempting to keep them going in a ring, as they are affected by
 * "forces" triggered by mouse actions and clicks.
 */

class Node {
    constructor(data) {
        this.data = data;

        this.RING_RADIUS = 265;
        this.MAX_LINK_LENGTH = 290;
        this.MOUSE_HOVER_DIST = 120;
        this.CLICKABLE_RADIUS_ADD = 0;
        this.IDLE_DRAG = 0.02;
        this.ACTIVE_DRAG = 0.5;
        this.ACTIVE_RADIUS = 175;
        this.STROKE_WIDTH = 10;

        const startAngle = Math.random() * Math.PI * 2;
        const startRadius = Math.random() * 20;
        const fallbackImg = 'assets/' + this.data.startsWith + '.webp';
        if (!this.data.iconUrlMedium || !this.data.iconUrlSmall) {
            this.data.iconUrlMedium = fallbackImg;
            this.data.iconUrlSmall = fallbackImg;
        }

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

        if (typeof this.data.iconUrlSmall !== 'undefined' && !this.data.lame) {
            this.thumbImg.src = this.data.iconUrlSmall;
        } else if (this.data.startsWith) {
            this.thumbImg.src = fallbackImg;
        }

        this.thumbImg.addEventListener('error', () => {
            this.thumbImg.src = fallbackImg;
        });
    }

    getAge() {
        return new Date().getTime() - this.start;
    }

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

    renderLink(ctx, filter) {
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

    linkTo(node) {
        if (!node.data.lame) {
            this.linkStartTime = new Date();
            this.link = node;
        }
    }

    killLink() {
        this.link = null;
    }
}

/**
 * Project explore component canvas renderer.
 */

function Explore(config_service) {
    var _this = this;
    var canvasEl = document.getElementById('canvasEL');
    this.AMBIENCE_RANDOM_ACTION_INTERVAL = 1000;
    this.AMBIENCE_WAIT_AFTER_USER_INPUT = 7000;
    this.LAME_NODE_COUNT = 25;
    this.canvas;
    this.done = false;
    this.context = canvasEl.getContext('2d');
    this.timer = window.requestAnimationFrame;
    this.frameCount = 0;
    this.nodes = [];
    this.activeNode;
    this.hoveredNode;
    this.nextActionTime;
    this.formVisible;
    this.mousePos;
    this.globalMousePos;
    this.hovered = false;
    this.pauseInteraction = false;
    this.selected_project = {};
    this.selected_project_changed = false;
    this.hovered_project = {};
    this.projects_subscription;
    this.config_service = config_service;
    this.canvas_width = config_service.MOBILE_WIDTH;
    this.canvas_height = config_service.MOBILE_WIDTH;
    /*
     * Navigate to the list view.
     */
    this.navigateToListView = function () {
        this.projects_service.requestParams.page_size = this.config_service.LIST_PAGE_SIZE;
        this.router.navigate(['/list', 'featured']);
    };

    /**
     * Gets projects from `projects_service` and creates a new `Node` for
     * each.
     */
    this.loadProjects = function (p) {
        const projects = p.slice();
        const lame_node = { lame: true };
        const _that = this;
        _that.nodes = [];
        let lame_index = 0;

        while (lame_index < this.LAME_NODE_COUNT) {
            projects.push(lame_node);
            lame_index++;
        }

        projects.forEach(function (project, index) {
            if (index > 15 && !project.lame) {
                project.small = true;
            }
            _that.nodes.push(new Node(project));
        });
    };

    /**
     * Global click handler. Determines coordinates of click, whether a node was
     * clicked, and routes the action accordingly.
     * @param evt  click event.
     */
    this.clickHandler = function (evt) {
        const box = this.canvas.getBoundingClientRect();
        const coords = {
            x: evt.pageX - box.left - window.pageXOffset,
            y: evt.pageY - box.top - window.pageYOffset
        };
        const clicked_node = this.getNodeUnder(
            coords.x - this.canvas_width / 2,
            coords.y - this.canvas_height / 2
        );
        if (clicked_node) {
            if (clicked_node.active) {
                return;
            } else {
                this.selectNone();
                clicked_node.onClick();
                this.selectProject(clicked_node);
            }
            // this.utils_service.trackEvent(
            //     'Projects_Explore', 'Click', 'Bubble ' + clicked_node.data.name);
        } else {
            this.selectNone();
        }
        this.userActionOccurred();
    };

    /**
     * Selects a given node (project).
     * @param node  the project object to be selected.
     */
    this.selectProject = function (node) {
        this.selected_project = node.data;
        selectedProject.prependTo(canvasContainer);
        selectedProject.attr('class', 'selected-project active');
        projectLogo.attr('src', this.selected_project.iconUrlMedium);
        projectTitle.text(this.selected_project.name);
        projectDescription.text(this.selected_project.summary);
        projectButton.attr('href', this.selected_project.url);
        setTimeout(() => {
            this.selected_project_changed = true;
        }, 200);
    };

    /**
     * Global mouse move handler. Determines coordinates of mouse and updates the
     * `globalMousePos` and `mousePos` objects.
     * @param evt  mouse move event.
     */
    this.moveHandler = function (evt) {
        this.hoveredNode = this.mousePos
            ? this.getNodeUnder(this.mousePos.x, this.mousePos.y)
            : null;

        const box = this.canvas.getBoundingClientRect();
        this.globalMousePos = {
            x: evt.pageX - box.left - window.pageXOffset,
            y: evt.pageY - box.top - window.pageYOffset
        };
        this.mousePos = new Vector(
            this.globalMousePos.x - this.canvas_width / 2,
            this.globalMousePos.y - this.canvas_height / 2,
            0
        );
        evt.preventDefault();
        evt.stopPropagation();
    };

    /**
     * Figures out which node (project) was hovered.
     * @param evt  click event.
     */
    this.hoverHandler = function () {
        if (!this.mousePos) {
            return;
        }
        const new_hovered_node = this.getNodeUnder(this.mousePos.x, this.mousePos.y);
        this.clearHoverStyles();

        if (this.hoveredNode && new_hovered_node) {
            this.setHoverStyles(new_hovered_node);
        }

        if (!this.hovered && this.hoveredNode && this.hoveredNode.data.small) {
            this.hoveredNode.fadeCount = 0;
        }
    };

    /**
     * Sets styles when a node is hovered.
     * @param new_hovered_node  project node being hovered.
     */
    this.setHoverStyles = function (new_hovered_node) {
        this.canvas.style.cursor = 'pointer';
        this.hovered_project = new_hovered_node;

        if (new_hovered_node.data.name != this.hoveredNode.data.name && this.hoveredNode.small) {
            new_hovered_node.data.focus = true;
            new_hovered_node.fadeCount = 0;
            this.hoveredNode.data.focus = false;
        } else {
            new_hovered_node.data.focus = false;
            this.hoveredNode.data.focus = true;
        }
        this.hovered = true;
    };

    /**
     * Removes styles when a node is NOT hovered.
     */
    this.clearHoverStyles = function () {
        this.canvas.style.cursor = 'default';
        this.nodes.forEach((node) => {
            node.data.focus = false;
        });
        this.hovered = false;
    };

    /**
     * update is the body of the animation loop. Controls canvas rendering.
     * Called once every timer tick.
     */
    this.update = function () {
        if (_this.done) {
            return;
        }

        _this.render(_this.context);
        _this.hoverHandler();

        if (_this.nodes.length) {
            _this.frameCount += 1;
        }

        if (_this.frameCount == 1) {
            _this.ambientActionOccurred();
        }

        _this.createLinks();

        _this.nodes.forEach((node) => {
            node.updateMousePos(_this.mousePos);
            node.update(_this.hoveredNode == node);
        });

        _this.updateAmbience();

        return _this.timer(_this.update);
    };

    /**
     * Draws lines from/to random project nodes.
     */
    this.createLinks = function () {
        for (var n of this.nodes) {
            if (n.link != null) {
                continue;
            }
            // # continue if Math.random() > 0.9
            n.linkTo(this.nodes[Math.floor(Math.random() * this.nodes.length)]);
        }
    };

    /**
     * The convas renderer. Everything is drawn into the canvas here.
     */
    this.render = function (ctx) {
        ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);
        ctx.save();
        ctx.translate(this.canvas_width / 2, this.canvas_height / 2);

        // Lines on bottom
        // FF Can't deal with stroked shapes
        if ('chrome' !== 'Firefox') {
            this.nodes.forEach((node, index) => {
                node.renderLink(ctx);
            });
        }

        // Lame (gray non-interactive) nodes next
        this.nodes.forEach((node, index) => {
            if (node.data.lame && !node.active) {
                node.render(ctx);
            }
        });

        // Then small colored project nodes
        this.nodes.forEach((node, index) => {
            if (!node.data.lame && !node.active && node.data.small) {
                node.render(ctx);
            }
        });

        // Then large colored project nodes with logo
        this.nodes.forEach((node, index) => {
            if (!node.data.lame && !node.active && !node.data.small && !node.data.focus) {
                node.render(ctx);
            }
        });

        // Hovered next
        this.nodes.forEach((node, index) => {
            if (!node.data.lame && !node.active && node.data.focus) {
                node.render(ctx);
            }
        });

        // Selected node on top
        this.nodes.forEach((node, index) => {
            if (!node.data.lame && node.active) {
                node.render(ctx);
            }
        });

        ctx.restore();
    };

    /**
     * Sets `nextActionTime` Date object.
     * @param offset  in milliseconds
     */
    this.setNextActionDelay = function (offset) {
        this.nextActionTime = new Date(new Date().getTime() + offset);
    };

    /**
     * Sets `nextActionTime` Date object and selects active node.
     */
    this.userActionOccurred = function () {
        this.setNextActionDelay(this.AMBIENCE_WAIT_AFTER_USER_INPUT);
        this.activeNode = this.getActiveNodes()[0];
    };

    /**
     * Selects active node.
     */
    this.ambientActionOccurred = function () {
        this.activeNode = this.getActiveNodes()[0];
    };

    /**
     * Gets `nextActionTime` Date object minus current time.
     */
    this.timeUntilNextAction = function () {
        return this.nextActionTime - new Date().getTime();
    };

    /**
     * Does random action when `timeUntilNextAction` gets to 0.
     */
    this.updateAmbience = function () {
        if (this.timeUntilNextAction() < 0) {
            this.doRandomAction();
            return this.ambientActionOccurred();
        }
    };

    /**
     * Filters nodes by `active` attribute.
     */
    this.getActiveNodes = function () {
        return this.nodes.filter(function (n) {
            return n.active;
        });
    };

    /**
     * Activates a random node.
     *
     * This method controls which nodes end up in the center, and for how
     * long (unless overridden by user input.)
     */
    this.doRandomAction = function () {
        let node;
        const filteredNodes = this.filterLames();
        if (this.pauseInteraction) {
            return;
        }

        if (this.getActiveNodes().length) {
            // make the current node leave the center and schedule the next
            // action.
            this.setNextActionDelay(this.AMBIENCE_RANDOM_ACTION_INTERVAL);
            return this.selectNone();
        } else {
            // pick a random node to display in the center
            node = filteredNodes[Math.floor(Math.random() * filteredNodes.length)];
            if (node != null) {
                this.setNextActionDelay(this.AMBIENCE_WAIT_AFTER_USER_INPUT);
                node.activate();
                this.selectProject(node);
            }
        }
    };

    /**
     * Filters out the grey (lame) nodes.
     */
    this.filterLames = function () {
        return this.nodes.filter((node) => !node.data.lame);
    };

    /**
     * Deselects all nodes.
     */
    this.selectNone = function () {
        // selectedProject.attr("class", "selected-project");
        selectedProject.remove();
        this.selected_project = {};
        this.selected_project_changed = false;
        for (var n of this.nodes) {
            n.deactivate();
        }
    };

    /**
     * Select the node under a specific x, y coordinate.
     * @param x  x coord.
     * @param y  y coord.
     */
    this.getNodeUnder = function (x, y) {
        let nodes = [];
        let chosen = null;

        for (var i = this.nodes.length - 1; i >= 0; i += -1) {
            var n = this.nodes[i];
            if (n.hitTest(x, y) && !n.data.lame) {
                nodes.push(n);
            }
        }
        nodes.forEach((node) => {
            if (!node.data.small) {
                chosen = node;
            }
        });
        return nodes.length && !chosen ? nodes[0] : chosen;
    };

    /**
     * Navigate to a project's details page.
     * @param evt  mouse event.
     */
    this.loadProjectDetails = function (evt) {
        this.projects_service.cachedColor =
            this.selected_project.fallbackColor || this.selected_project.primaryColor;

        this.router.navigate(['/', this.selected_project.id]);

        // this.utils_service.trackEvent(
        //     'Projects_Explore', 'Click', 'View ' + this.selected_project.name);
        evt.preventDefault();
        evt.stopPropogation;
    };

    /**
     * Carousel algorithm to next/back through projects.
     * @param direction  iterator to go up or down `+1` or `-1`.
     * @param $event  mouse event.
     */
    this.clickedArrow = function (direction, $event) {
        let currentIndex = 0;
        let newIndex;
        let chosen;
        const filteredNodes = this.filterLames();

        filteredNodes.forEach((node, index) => {
            if (node.active) {
                currentIndex = index;
            }
        });

        newIndex = this.utils_service.modulo(currentIndex + direction, filteredNodes.length);
        this.selectNone();
        chosen = filteredNodes[newIndex];
        chosen.activate();
        this.selectProject(chosen);
        this.userActionOccurred();

        // this.utils_service.trackEvent(
        //     'Projects_Explore', 'Click', 'Cycle ' + direction);

        $event.stopPropagation();
    };

    this.onInit = async function () {
        const dpi = window.devicePixelRatio || 1;
        this.canvas = document.getElementById('canvasEL');

        // Size the canvas based on device dpi
        this.canvas.width = this.canvas_width * dpi;
        this.canvas.height = this.canvas_height * dpi;

        // Set 2d rendering context
        this.context = this.canvas.getContext('2d');
        this.context.scale(dpi, dpi);

        this.done = false;

        // Reset language filters
        // this.languages_service.selectedLanguages = [];

        // Listen for projects to come back from API

        this.selectNone();
        const res = await fetch('./data/data.json');
        const projects = await res.json();
        this.loadProjects(projects);
        this.doRandomAction();
        this.canvas.dispatchEvent(new Event('mousemove'));

        this.canvas.addEventListener('mousemove', (event) => {
            this.moveHandler(event);
        });
        this.canvas.addEventListener('click', (event) => {
            this.clickHandler(event);
        });
        this.canvas.addEventListener('mouseover', (event) => {
            this.pauseInteraction = true;
        });
        this.canvas.addEventListener('mouseout', (event) => {
            this.pauseInteraction = false;
        });

        return this.timer(this.update);
    };
}

/**
 * If on a screen narrower than MOBILE_WIDTH, do not render and navigate to
 * list page.
 */
Explore.onInit = function () {
    const dpi = window.devicePixelRatio || 1;
    this.canvas = document.getElementById('canvasEL');

    // Size the canvas based on device dpi
    this.canvas.width = this.canvas_width * dpi;
    this.canvas.height = this.canvas_height * dpi;

    // Set 2d rendering context
    this.context = this.canvas.getContext('2d');
    this.context.scale(dpi, dpi);

    this.done = false;

    // Reset language filters
    // this.languages_service.selectedLanguages = [];

    // Listen for projects to come back from API

    this.selectNone();
    this.loadProjects(projects);
    this.doRandomAction();
    this.canvas.dispatchEvent(new Event('mousemove'));

    this.canvas.addEventListener('mousemove', (event) => {
        this.moveHandler(event);
    });
    this.canvas.addEventListener('click', (event) => {
        this.clickHandler(event);
    });
    this.canvas.addEventListener('mouseover', (event) => {
        this.pauseInteraction = true;
    });
    this.canvas.addEventListener('mouseout', (event) => {
        this.pauseInteraction = false;
    });

    return this.timer(this.update);
};

Explore.prototype.onDestroy = function () {
    this.done = true;
};

const explorer = new Explore(config_service);
window.onload = explorer.onInit();
