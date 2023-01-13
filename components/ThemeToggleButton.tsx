import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'next-themes';

const ThemeToggleButton = (props: any) => {
    const { theme, setTheme } = useTheme();

    return (
        <button
            className="w-9 h-9 bg-zinc-300 dark:bg-zinc-900 rounded-lg hover:ring-2 ring-gray-400 dark:ring-white transition-all"
            onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
            }}>
            {theme === 'dark' && <FontAwesomeIcon icon={faSun} />}
            {theme === 'light' && <FontAwesomeIcon icon={faMoon} />}
        </button>
    );
};

export default ThemeToggleButton;
