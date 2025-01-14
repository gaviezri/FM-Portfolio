export interface ProjectInfo {
    id: string;
    title: string;
    description: string;
    year: string;
    location: string;
    area: string;
    thumbnail: string;
    images: string[];
    category?: string;
    ordinal: number;
}

export interface CategoryInfo {
    title: string;
    description: string;
    projects: ProjectInfo[];
}

export interface Slide {
    id: string;
    category: string;
    title: string;
    thumbnail: string;
}
