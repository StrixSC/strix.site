import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const ModeToggleButton = (props: any) => {
    const [isDark, setDark] = useState(false);

    return (
        <button
            onClick={() => {
                setDark(isDark ? false : true);
            }}>
            {isDark && <FontAwesomeIcon icon={faSun} />}
            {!isDark && <FontAwesomeIcon icon={faMoon} />}
        </button>
    );
};

export default ModeToggleButton;
