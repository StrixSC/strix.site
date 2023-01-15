import { ComponentProps, useEffect, useState } from 'react';
import Explore from './Explore';
import config from '@lib/config.json';

const Projects = (props?: ComponentProps<any>) => {
    return (
        <div>
            <Explore config={config}></Explore>
        </div>
    );
};

export default Projects;
