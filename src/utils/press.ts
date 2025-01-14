import path from "path";
import fs from "fs/promises";
import { PublicationInfo } from "@/types";
import { createPressThumbnailPath } from "./paths";
export const collectPressPublications = async () => {
    const pressPath = path.join(process.cwd(), "public", "press");

    try {
        const pressItems = await fs.readdir(pressPath, { withFileTypes: true });
        const publicationsDirs = pressItems.filter((item) =>
            item.isDirectory()
        );
        const publications = publicationsDirs.map(async (dir) => {
            const publicationDir = path.join(dir.parentPath, dir.name);
            const contentPath = path.join(publicationDir, "content.json");

            const contentRaw = await fs.readFile(contentPath, "utf-8");
            const content: PublicationInfo = JSON.parse(contentRaw);
            content.thumbnail = createPressThumbnailPath(dir.name);
            return content;
        });
        return Promise.all(publications);
    } catch (e) {
        console.log("ERROR @ press.ts:" + e);
        return [];
    }
};
