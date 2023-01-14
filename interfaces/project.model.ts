export default interface Project {
    title: string;
    description: string;
    url: string;
    bcolor: {
        R: number;
        G: number;
        B: number;
        A: number;
    };
    bopacity: number;
    image: string;
    tech: {
        slug: string;
        name: string;
    }[];
}
