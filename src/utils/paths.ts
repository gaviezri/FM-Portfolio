export function createImagePath(
    category: string,
    projectId: string,
    imageName: string
): string {
    return `/categories/${category}/${projectId}/images/${decodeURIComponent(
        imageName
    )}`;
}
