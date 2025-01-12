export function encodePathSegment(segment: string): string {
    // First decode to handle any existing encoding, then encode once
    try {
        const decodedSegment = decodeURIComponent(segment);
        return encodeURIComponent(decodedSegment);
    } catch {
        return encodeURIComponent(segment);
    }
}

export function decodePathSegment(segment: string): string {
    try {
        return decodeURIComponent(segment);
    } catch {
        return segment;
    }
}

export function normalizeFilePath(filePath: string): string {
    // Convert backslashes to forward slashes and ensure leading slash
    return filePath.split("\\").join("/").replace(/^\/?/, "/");
}

export function createProjectPath(category: string, projectId: string): string {
    return `/${category}/${encodePathSegment(projectId)}`;
}

export function createImagePath(
    category: string,
    projectId: string,
    imageName: string
): string {
    return `/categories/${category}/${encodePathSegment(
        projectId
    )}/images/${encodePathSegment(imageName)}`;
}

export function toFileSystemPath(path: string): string {
    return decodePathSegment(path);
}
