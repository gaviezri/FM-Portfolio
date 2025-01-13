import fs from "fs/promises";
import path from "path";
import { ProjectInfo } from "@/types";
import { createImagePath } from "./paths";

export async function getAllProjects() {
    const categories = ["commercial", "residential"];
    let allProjects: ProjectInfo[] = [];

    // Wait for all categories to be processed
    await Promise.all(
        categories.map(async (category) => {
            const projectsForCategory = await getProjectsForCategory(category);
            allProjects = [...allProjects, ...projectsForCategory];
        })
    );

    return allProjects;
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
        // Get all project directories in the category
        const items = await fs.readdir(categoryPath, { withFileTypes: true });
        const projectDirs = items.filter((item) => item.isDirectory());

        // Load each project using getProject
        const projectPromises = projectDirs.map((dir) =>
            getProject(category, dir.name).catch((error) => {
                console.error(`Error loading project ${dir.name}:`, error);
                return null;
            })
        );

        const projects = await Promise.all(projectPromises);

        return projects
            .filter((project): project is ProjectInfo => project !== null)
            .sort((a, b) => Number.parseInt(b.year) - Number.parseInt(a.year));
    } catch (error) {
        console.error(`Error reading category directory ${category}:`, error);
        return [];
    }
}

export async function getProject(category: string, projectId: string) {
    try {
        const manifestPath = path.join(
            process.cwd(),
            "public",
            "categories",
            category,
            projectId,
            "manifest.json"
        );

        const imagesDir = path.join(
            process.cwd(),
            "public",
            "categories",
            category,
            projectId,
            "images"
        );

        const [manifestContent, imageFiles] = await Promise.all([
            fs.readFile(manifestPath, "utf-8"),
            fs.readdir(imagesDir),
        ]);

        const projectData = JSON.parse(manifestContent);
        const images = imageFiles.map((file) =>
            createImagePath(category, projectId, file)
        );

        return {
            ...projectData,
            id: projectId,
            category: category,
            thumbnail: createImagePath(
                category,
                projectId,
                projectData.thumbnail
            ),
            images,
        };
    } catch (error) {
        console.error(`Error loading project ${projectId}:`, error);
        throw new Error(`Project not found: ${projectId}`);
    }
}
