import { themes } from "../public/data/themes";
import { useEffect, useState } from "react";
import { themeChange } from "theme-change";

export default function ThemePicker() {
    const themesData = [];
    const [selectedTheme, setSelectedTheme] = useState("showdown");
    useEffect(() => {
        themeChange(false);
    }, []);

    for (let theme of themes) {
        themesData.push(
            <button
                key={theme.id}
                className="overflow-hidden text-left rounded-lg outline-base-content"
                data-set-theme={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
            >
                <div
                    data-theme={theme.id}
                    className="w-full font-sans cursor-pointer bg-base-100 text-base-content"
                >
                    <div className="grid grid-cols-5 grid-rows-3">
                        <div className="flex items-center col-span-5 row-span-3 row-start-1 gap-2 px-4 py-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className={
                                    selectedTheme === theme.id
                                        ? "visible"
                                        : "invisible" + " w-3 h-3"
                                }
                            >
                                <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                            </svg>
                            <div className="flex-grow text-sm font-bold">
                                {theme.name.split(" ")[1]}
                            </div>
                            <div className="flex flex-wrap flex-shrink-0 h-full gap-1">
                                <div className="w-2 rounded bg-primary" />
                                <div className="w-2 rounded bg-secondary" />
                                <div className="w-2 rounded bg-accent" />
                                <div className="w-2 rounded bg-neutral" />
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        );
    }

    return (
        <>
            <div
                tabIndex={0}
                className="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px max-h-96 h-[70vh] w-52 overflow-y-auto shadow-xl mt-16"
            >
                <div className="grid grid-cols-1 gap-3 p-3">{themesData}</div>
            </div>
        </>
    );
}
