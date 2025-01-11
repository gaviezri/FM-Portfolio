import fs from "fs/promises";
import path from "path";
import { ProjectInfo } from "@/types";

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

                    // Validate required fields
                    if (!projectData.title || !projectData.thumbnailUrl) {
                        console.error(
                            `Missing required fields in manifest for ${dir.name}`
                        );
                        return null;
                    }

                    return {
                        ...projectData,
                        id: dir.name,
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

        // Remove any null entries and type cast the result
        return projects.filter(
            (project): project is ProjectInfo => project !== null
        );
    } catch (error) {
        console.error(`Error reading category directory ${category}:`, error);
        return [];
    }
}
