import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'next-themes';

const ThemeToggleButton = (props: any) => {
    const { theme, setTheme } = useTheme();

    return (
        <button
            className="w-9 h-9 bg-gray-200 rounded-lg dark:bg-gray-600 flex items-center justify-center hover:ring-2 ring-gray-300 transition-all"
            onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
            }}>
            {theme === 'dark' && <FontAwesomeIcon icon={faSun} />}
            {theme === 'light' && <FontAwesomeIcon icon={faMoon} />}
        </button>
    );
};

export default ThemeToggleButton;
