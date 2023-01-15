import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'next-themes';

const ThemeToggleButton = (props: any) => {
    const { theme, setTheme } = useTheme();

    return (
        <button
            className="transition-all rounded-lg w-9 h-9 bg-zinc-300 dark:bg-zinc-900 hover:ring-2 "
            onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
            }}>
            {theme === 'dark' && <FontAwesomeIcon icon={faSun} />}
            {theme === 'light' && <FontAwesomeIcon icon={faMoon} />}
        </button>
    );
};

export default ThemeToggleButton;
