import { Project } from '@interfaces/project.model';
import Vector from '@interfaces/vector';
import Node from '@interfaces/node';
import { ComponentProps, useEffect, useState } from 'react';
import projects from '@lib/data.json';

const Explore = (props: ComponentProps<any>) => {
    const styles = {
        width: 720,
        height: 720
    };
    let loaded = false;
    const { config } = props;

    useEffect(() => {
        init();
        loaded = true;
        return () => {
            done = true;
        };
    }, []);

    const AMBIENCE_RANDOM_ACTION_INTERVAL = 1000;
    const AMBIENCE_WAIT_AFTER_USER_INPUT = 7000;
    const LAME_NODE_COUNT = 25;
    let canvasEl: HTMLCanvasElement;
    let canvas: HTMLCanvasElement;
    let done = false;
    let context: CanvasRenderingContext2D;
    let timer: (callback: FrameRequestCallback) => number;
    let frameCount = 0;
    let nodes = [] as Node[];
    let activeNode: Node;
    let hoveredNode: Node;
    let nextActionTime: Date;
    let mousePos: Vector;
    let globalMousePos: { x: number; y: number };
    let hovered = false;
    let pauseInteraction = false;
    let selected_project: Project = {};
    let selected_project_changed = false;
    let hovered_project: Node;
    let canvas_width = config.MOBILE_WIDTH;
    let canvas_height = config.MOBILE_WIDTH;

    const init = () => {
        canvasEl = document.getElementById('canvasEL') as HTMLCanvasElement;
        context = canvasEl.getContext('2d');
        timer = window.requestAnimationFrame;
        const dpi = window.devicePixelRatio || 1;
        canvas = document.getElementById('canvasEL') as HTMLCanvasElement;

        // Size the canvas based on device dpi
        canvas.width = canvas_width * dpi;
        canvas.height = canvas_height * dpi;

        // Set 2d rendering context
        context = canvas.getContext('2d');
        context.scale(dpi, dpi);

        done = false;

        selectNone();
        loadProjects(projects);
        doRandomAction();
        canvas.dispatchEvent(new Event('mousemove'));

        canvas.addEventListener('mousemove', (event) => {
            moveHandler(event);
        });
        canvas.addEventListener('click', (event) => {
            clickHandler(event);
        });
        canvas.addEventListener('mouseover', (event) => {
            pauseInteraction = true;
        });
        canvas.addEventListener('mouseout', (event) => {
            pauseInteraction = false;
        });

        return timer(update);
    };

    const loadProjects = function (p: Project[]) {
        const projects = p.slice();
        const lame_node = { lame: true };
        nodes = [];
        let lame_index = 0;

        while (lame_index < LAME_NODE_COUNT) {
            projects.push(lame_node);
            lame_index++;
        }

        projects.forEach(function (project, index) {
            if (index > 15 && !project.lame) {
                project.small = true;
            }
            nodes.push(new Node(project));
        });
    };

    const getNodeUnder = (x: number, y: number): Node => {
        let under = [];
        let chosen = null;

        for (var i = nodes.length - 1; i >= 0; i += -1) {
            var n = nodes[i];
            if (n.hitTest(x, y) && !n.data.lame) {
                under.push(n);
            }
        }
        under.forEach((node) => {
            if (!node.data.small) {
                chosen = node;
            }
        });

        return under.length && !chosen ? under[0] : chosen;
    };

    const selectNone = () => {
        selected_project = {};
        selected_project_changed = false;

        for (var n of nodes) {
            n.deactivate();
        }
    };

    const selectProject = (node: Node) => {
        selected_project = node.data;
        setTimeout(() => {
            selected_project_changed = true;
        }, 500);
    };

    const moveHandler = (evt: MouseEvent) => {
        hoveredNode = mousePos ? getNodeUnder(mousePos.x, mousePos.y) : null;

        const box = canvas.getBoundingClientRect();
        globalMousePos = {
            x: evt.pageX - box.left - window.pageXOffset,
            y: evt.pageY - box.top - window.pageYOffset
        };
        mousePos = new Vector(
            globalMousePos.x - canvas_width / 2,
            globalMousePos.y - canvas_height / 2,
            0
        );
        evt.preventDefault();
        evt.stopPropagation();
    };

    const clickHandler = (evt: MouseEvent) => {
        const box = canvas.getBoundingClientRect();
        const coords = {
            x: evt.pageX - box.left - window.pageXOffset,
            y: evt.pageY - box.top - window.pageYOffset
        };
        const clicked_node = getNodeUnder(
            coords.x - canvas_width / 2,
            coords.y - canvas_height / 2
        );
        if (clicked_node) {
            if (clicked_node.active) {
                clicked_node.onClick();
            } else {
                selectNone();
                clicked_node.onClick();
                selectProject(clicked_node);
            }
        } else {
            selectNone();
        }
        userActionOccurred();
    };

    const hoverHandler = () => {
        if (!mousePos) {
            return;
        }
        const new_hovered_node = getNodeUnder(mousePos.x, mousePos.y);
        clearHoverStyles();

        if (hoveredNode && new_hovered_node) {
            setHoverStyles(new_hovered_node);
        }

        if (!hovered && hoveredNode && hoveredNode.data.small) {
            hoveredNode.fadeCount = 0;
        }
    };

    const setHoverStyles = (new_hovered_node: Node) => {
        canvas.style.cursor = 'pointer';
        hovered_project = new_hovered_node;

        if (new_hovered_node.data.name != hoveredNode.data.name && hoveredNode.data.small) {
            new_hovered_node.data.focus = true;
            new_hovered_node.fadeCount = 0;
            hoveredNode.data.focus = false;
        } else {
            new_hovered_node.data.focus = false;
            hoveredNode.data.focus = true;
        }
        hovered = true;
    };

    const clearHoverStyles = () => {
        canvas.style.cursor = 'default';
        nodes.forEach((node) => {
            node.data.focus = false;
        });
        hovered = false;
    };

    const userActionOccurred = () => {
        setNextActionDelay(AMBIENCE_WAIT_AFTER_USER_INPUT);
        activeNode = getActiveNodes()[0];
    };

    const setNextActionDelay = (offset: number) => {
        nextActionTime = new Date(new Date().getTime() + offset);
    };

    const getActiveNodes = (): Node[] => {
        return nodes.filter((n: Node) => {
            return n.active;
        });
    };

    const update = () => {
        if (done) {
            return;
        }

        render(context);
        hoverHandler();

        if (nodes.length) {
            frameCount += 1;
        }

        if (frameCount == 1) {
            ambientActionOccurred();
        }

        createLinks();

        nodes.forEach((node) => {
            node.updateMousePos(mousePos);
            node.update(hoveredNode == node);
        });

        updateAmbience();

        return timer(update);
    };

    const createLinks = () => {
        for (var n of nodes) {
            if (n.link != null) {
                continue;
            }
            n.linkTo(nodes[Math.floor(Math.random() * nodes.length)]);
        }
    };

    const render = (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, canvas_width, canvas_height);
        ctx.save();
        ctx.translate(canvas_width / 2, canvas_height / 2);

        nodes.forEach((node, index) => {
            node.renderLink(ctx);
        });

        // Lame (gray non-interactive) nodes next
        nodes.forEach((node) => {
            if (node.data.lame && !node.active) {
                node.render(ctx);
            }
        });

        // Then small colored project nodes
        nodes.forEach((node) => {
            if (!node.data.lame && !node.active && node.data.small) {
                node.render(ctx);
            }
        });

        // Then large colored project nodes with logo
        nodes.forEach((node) => {
            if (!node.data.lame && !node.active && !node.data.small && !node.data.focus) {
                node.render(ctx);
            }
        });

        // Hovered next
        nodes.forEach((node) => {
            if (!node.data.lame && !node.active && node.data.focus) {
                node.render(ctx);
            }
        });

        // Selected node on top
        nodes.forEach((node) => {
            if (!node.data.lame && node.active) {
                node.render(ctx);
            }
        });

        ctx.restore();
    };

    const ambientActionOccurred = () => {
        activeNode = getActiveNodes()[0];
    };

    const timeUntilNextAction = () => {
        return nextActionTime.getTime() - new Date().getTime();
    };

    /**
     * Does random action when `timeUntilNextAction` gets to 0.
     */
    const updateAmbience = () => {
        if (timeUntilNextAction() < 0) {
            doRandomAction();
            return ambientActionOccurred();
        }
    };

    const doRandomAction = () => {
        let node: Node;
        const filteredNodes = filterLames();
        if (pauseInteraction) {
            return;
        }

        if (getActiveNodes().length) {
            // make the current node leave the center and schedule the next
            // action.
            setNextActionDelay(AMBIENCE_RANDOM_ACTION_INTERVAL);
            return selectNone();
        } else {
            // pick a random node to display in the center
            node = filteredNodes[Math.floor(Math.random() * filteredNodes.length)];
            if (node != null) {
                setNextActionDelay(AMBIENCE_WAIT_AFTER_USER_INPUT);
                node.activate();
                selectProject(node);
            }
        }
    };

    const filterLames = () => {
        return nodes.filter((node) => !node.data.lame);
    };

    return (
        <div>
            <canvas id="canvasEL" height="320" width="480" style={styles}></canvas>
            {loaded && (
                <div
                    className={
                        selected_project_changed
                            ? 'selected-project active'
                            : 'selected-project unactive'
                    }>
                    <div className="project-summary">
                        <img src={`${selected_project.iconUrlMedium}`} alt="logo" />
                        <h5>{selected_project.name}</h5>
                        <p>{selected_project.summary}</p>
                    </div>
                    <a className="text-btn" href={`${selected_project.url}`}>
                        View Project
                    </a>
                </div>
            )}
        </div>
    );
};

export default Explore;
