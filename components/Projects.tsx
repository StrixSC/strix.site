import { ComponentProps, useEffect, useState, ReactEventHandler } from 'react';

const Projects = (props?: ComponentProps<any>) => {
    return (
        <div className="flex justify-center">
            <iframe
                id="iframe"
                className="rounded-full flex justify-center w-[750px]  h-[750px]"
                src="http://localhost:3000/graph.html"></iframe>
        </div>
    );
};

export default Projects;
