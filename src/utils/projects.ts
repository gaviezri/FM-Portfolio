import fs from "fs/promises";
import path from "path";
import { ProjectInfo } from "@/types";
import { encodePathSegment, createImagePath, toFileSystemPath } from "./paths";

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
                        id: encodePathSegment(dir.name),
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
        const decodedProjectId = toFileSystemPath(projectId);
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
        const images = imageFiles.map((file) =>
            createImagePath(category, decodedProjectId, file)
        );

        return {
            ...projectData,
            id: encodePathSegment(decodedProjectId),
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

                    return {
                        ...projectData,
                        id: encodePathSegment(dir.name),
                        thumbnail: createImagePath(
                            category,
                            dir.name,
                            projectData.thumbnail
                        ),
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
            .sort((a, b) => Number.parseInt(b.year) - Number.parseInt(a.year));
    } catch (error) {
        console.error(`Error reading category directory ${category}:`, error);
        return [];
    }
}
