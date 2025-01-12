// utils/projects.ts
import fs from "fs/promises";
import path from "path";
import { ProjectInfo } from "@/types";

export async function getAllProjects() {
    const categories = ["commercial", "residential"];
    const allProjects = [];

    for (const category of categories) {
        try {
            const categoryPath = path.join(
                process.cwd(),
                "public",
                "categories",
                category
            );
            const items = await fs.readdir(categoryPath, {
                withFileTypes: true,
            });
            const projectDirs = items.filter((item) => item.isDirectory());

            for (const dir of projectDirs) {
                try {
                    const manifestPath = path.join(
                        categoryPath,
                        dir.name,
                        "manifest.json"
                    );
                    const manifestContent = await fs.readFile(
                        manifestPath,
                        "utf-8"
                    );
                    const projectData = JSON.parse(manifestContent);

                    allProjects.push({
                        ...projectData,
                        id: dir.name, // Store original name, will be encoded when used in URLs
                        category: category,
                    });
                } catch (error) {
                    console.error(`Error loading project ${dir.name}:`, error);
                }
            }
        } catch (error) {
            console.error(`Error reading category ${category}:`, error);
        }
    }

    return allProjects;
}

export async function getProject(category: string, projectId: string) {
    try {
        // Since projectId comes from URL, it's encoded - decode it once
        const decodedProjectId = decodeURIComponent(projectId);
        const manifestPath = path.join(
            process.cwd(),
            "public",
            "categories",
            category,
            decodedProjectId,
            "manifest.json"
        );

        const imagesDir = path.join(
            process.cwd(),
            "public",
            "categories",
            category,
            decodedProjectId,
            "images"
        );

        const [manifestContent, imageFiles] = await Promise.all([
            fs.readFile(manifestPath, "utf-8"),
            fs.readdir(imagesDir),
        ]);

        const projectData = JSON.parse(manifestContent);
        const images = imageFiles.map(
            (file) =>
                `/categories/${category}/${decodedProjectId}/images/${file}`
        );

        return {
            ...projectData,
            id: decodedProjectId,
            images,
        };
    } catch (error) {
        console.error(`Error loading project ${projectId}:`, error);
        throw new Error(`Project not found: ${projectId}`);
    }
}

export async function getProjectsForCategory(
    category: string
): Promise<ProjectInfo[]> {
    const validCategories = ["residential", "commercial"];
    if (!validCategories.includes(category.toLowerCase())) {
        console.error(`Invalid category: ${category}`);
        return [];
    }

    const categoryPath = path.join(
        process.cwd(),
        "public",
        "categories",
        category
    );

    try {
        const items = await fs.readdir(categoryPath, { withFileTypes: true });
        const projectDirs = items.filter((item) => item.isDirectory());

        const projects = await Promise.all(
            projectDirs.map(async (dir) => {
                try {
                    const manifestPath = path.join(
                        categoryPath,
                        dir.name,
                        "manifest.json"
                    );
                    const manifestContent = await fs.readFile(
                        manifestPath,
                        "utf-8"
                    );
                    const projectData = JSON.parse(manifestContent);

                    if (!projectData.title || !projectData.thumbnail) {
                        console.error(
                            `Missing required fields in manifest for ${dir.name}`
                        );
                        return null;
                    }

                    const imagesPath = path.join(
                        categoryPath,
                        dir.name,
                        "images"
                    );
                    const images = await collectImagesSrc(
                        category,
                        dir.name,
                        imagesPath
                    );

                    return {
                        ...projectData,
                        id: dir.name,
                        thumbnail: `/categories/${category}/${encodeURIComponent(
                            dir.name
                        )}/images/${encodeURIComponent(projectData.thumbnail)}`,
                        images,
                    };
                } catch (error) {
                    console.error(
                        `Error loading manifest for ${dir.name}:`,
                        error
                    );
                    return null;
                }
            })
        );

        return projects
            .filter((project): project is ProjectInfo => project !== null)
            .sort(
                (project1, project2) =>
                    Number.parseInt(project2.year) -
                    Number.parseInt(project1.year)
            );
    } catch (error) {
        console.error(`Error reading category directory ${category}:`, error);
        return [];
    }
}

async function collectImagesSrc(
    category: string,
    projectId: string,
    imagesDir: string
): Promise<string[]> {
    try {
        const files = await fs.readdir(imagesDir);
        return files.map(
            (file) =>
                `/categories/${category}/${encodeURIComponent(
                    projectId
                )}/images/${encodeURIComponent(file)}`
        );
    } catch (error) {
        console.error(`Error reading directory ${imagesDir}:`, error);
        return [];
    }
}
