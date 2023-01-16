import { ComponentProps, useEffect, useState, ReactEventHandler } from 'react';

const Projects = (props?: ComponentProps<any>) => {
    const detectUrlClick = () => {
        const location = (document.getElementById('iframe') as HTMLIFrameElement).contentWindow
            .location.href;

        if (location != 'http://localhost:5500/dist/') {
            console.log('location changed', location);
        }
    };
    return (
        <div className="flex justify-center">
            <iframe
                id="iframe"
                onLoad={detectUrlClick}
                className="w-[1000px]  h-[1000px]"
                src="http://localhost:3000/graph.html"></iframe>
        </div>
    );
};

export default Projects;
