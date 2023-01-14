import { ComponentProps } from 'react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import Bubble from '@interfaces/bubble';
import p5Types from 'p5';
import exampleProjects from '@lib/example-projects.json';
import Project from '@interfaces/project.model';

const Projects = (props?: ComponentProps<any>) => {
    const { theme } = useTheme();
    let background = 0;
    const componentsDidMount = () => {};
    let parent: Element;
    let canvas: p5Types.Renderer;
    let bubbles: Bubble[] = [];
    let width = 500;
    let height = 500;
    const MAX_SMALL_BUBBLE_RADIUS = 10;
    const MIN_SMALL_BUBBLE_RADIUS = 5;
    let main: p5Types.Vector;
    let angle = 0;
    let mainr = width / 3.4;
    let mainBorderColor = '#000000';
    const Sketch = dynamic(
        () => {
            return import('react-p5');
        },
        {
            loading: () => <div>'Loading...'</div>,
            ssr: false
        }
    );

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        parent = canvasParentRef;
        canvas = p5.createCanvas(width, height);
        canvas.parent(canvasParentRef);
        main = p5.createVector(0, 0);
        p5.translate(width / 2, height / 2);
        let maxr = width / 2;

        for (const p of exampleProjects) {
            let br = p5.random(mainr + MAX_SMALL_BUBBLE_RADIUS, maxr - MIN_SMALL_BUBBLE_RADIUS);
            let radius = p5.random(MIN_SMALL_BUBBLE_RADIUS, MAX_SMALL_BUBBLE_RADIUS);
            let theta = p5.random(0, 2 * p5.PI);
            let x = br * p5.cos(theta);
            let y = br * p5.sin(theta);
            bubbles.push(new Bubble(p, p5, p5.createVector(x, y), radius));
        }
        console.log(bubbles);
    };

    const draw = (p5: p5Types) => {
        p5.angleMode('degrees');
        p5.background(255);
        p5.translate(width / 2, height / 2);
        for (let bubble of bubbles) {
            bubble.rotate();
            bubble.render();
        }
    };

    const checkMousePos = (
        p5: p5Types,
        callback: (bubble: Bubble) => any,
        callbackFalsy?: (bubble: Bubble) => any
    ) => {
        const mouseX = p5.mouseX - width / 2; // We have to translate the mouse coordinates too
        const mouseY = p5.mouseY - height / 2;
        for (let bubble of bubbles) {
            if (p5.dist(mouseX, mouseY, bubble.com.x, bubble.com.y) <= bubble.radius) {
                callback(bubble);
            } else {
                if (callbackFalsy) {
                    callbackFalsy(bubble);
                }
            }
        }
    };
    const mousePressed = (p5: p5Types) => {
        checkMousePos(p5, (bubble: Bubble) => {
            bubble.onClick();
        });
    };

    const mouseMoved = (p5: p5Types) => {
        checkMousePos(
            p5,
            (bubble: Bubble) => {
                bubble.onHover();
            },
            (bubble) => {
                bubble.onHoverOff();
            }
        );
    };

    return (
        <div className="flex relative justify-center">
            <div
                id="project-viewer"
                className="rounded-full absolute flex justify-center items-center"></div>
            <Sketch
                className="rounded-md bg-white border-neutral-300 dark:border-neutral-900 border-2"
                setup={setup}
                mouseMoved={mouseMoved}
                mousePressed={mousePressed}
                draw={draw}></Sketch>
        </div>
    );
};

export default Projects;
