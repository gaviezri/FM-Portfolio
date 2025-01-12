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

    const publicCategoryPath = categoryPath.split("public")[1];

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
                    if (!projectData.title || !projectData.thumbnail) {
                        console.error(
                            `Missing required fields in manifest for ${dir.name}`
                        );
                        return null;
                    }

                    return {
                        ...projectData,
                        thumbnail: constructThumbnailPath(
                            publicCategoryPath,
                            dir.name,
                            projectData.thumbnail
                        ),
                        id: dir.name,
                        images: collectImagesSrc(
                            path.join(categoryPath, dir.name, "images")
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

        // Remove any null entries and type cast the result
        return projects.filter(
            (project): project is ProjectInfo => project !== null
        );
    } catch (error) {
        console.error(`Error reading category directory ${category}:`, error);
        return [];
    }
}

export async function collectImagesSrc(imagesDir: string): Promise<string[]> {
    try {
        const files = await fs.readdir(imagesDir);

        // Convert the full path to a public URL path
        return files.map((file) => {
            // Find the 'public' directory in the path and get everything after it
            const pathParts = imagesDir.split("public");
            const publicPath = pathParts[pathParts.length - 1];
            // Construct the URL path, ensuring proper formatting
            return (
                path
                    .join(publicPath, file)
                    .split(path.sep)
                    .join("/")
                    // Ensure it starts with a forward slash
                    .replace(/^\/?/, "/")
                    // Replace spaces with URL-safe characters
                    .split(" ")
                    .join("%20")
            );
        });
    } catch (error) {
        console.error(`Error reading directory ${imagesDir}:`, error);
        return [];
    }
}

function constructThumbnailPath(
    publicCategoryPath: string,
    dirName: string,

    thumbnail: string
) {
    const thePath = path
        .join(publicCategoryPath, dirName, "images", thumbnail)
        .replace(/\\/g, "/");
    return thePath;
}

export async function getProject(category: string, projectId: string) {
    try {
        const adjustedProjectId = projectId.replace(/%20/g, " ");
        const manifestPath = path.join(
            process.cwd(),
            "public",
            "categories",
            category,
            adjustedProjectId,
            "manifest.json"
        );

        const imagesDir = path.join(
            process.cwd(),
            "public",
            "categories",
            category,
            adjustedProjectId,
            "images"
        );

        const [manifestContent, imageFiles] = await Promise.all([
            fs.readFile(manifestPath, "utf-8"),
            fs.readdir(imagesDir),
        ]);

        const projectData = JSON.parse(manifestContent);
        const images = imageFiles.map((file) => ({
            src: `/categories/${category}/${projectId}/images/${file}`,
            alt: file.split(".")[0],
        }));

        return {
            ...projectData,
            id: projectId,
            images,
        };
    } catch (error) {
        console.error(`Error loading project ${projectId}:`, error);
        throw new Error(`Project not found: ${projectId}`);
    }
}
