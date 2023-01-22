import { useState } from 'react';
import NavItem from './NavItem';

const CVButton = () => {
    const [dropDownState, setDropDownState] = useState(false);

    return (
        <div className="relative" onClick={() => setDropDownState(!dropDownState)}>
            <NavItem href="" text="CV">
                CV
            </NavItem>
            {dropDownState && (
                <div className="absolute right-0 flex flex-col items-center mt-2 bg-neutral-100 dark:bg-neutral-800">
                    <NavItem className="w-full" href="/resume_fr.html" text="French"></NavItem>
                    <NavItem className="w-full" text="English" href="/resume.html"></NavItem>
                </div>
            )}
        </div>
    );
};

export default CVButton;
