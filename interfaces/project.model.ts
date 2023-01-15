export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface Project {
    id?: string;
    name?: string;
    summary?: string;
    iconUrlSmall?: string;
    url?: string;
    iconUrlMedium?: string;
    primaryColor?: string;
    startsWith?: string;
    fallbackColor?: string;
    RGB?: RGB;
    lame?: boolean;
    small?: boolean;
    focus?: boolean;
}
