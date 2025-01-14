const basePath = process.env.NODE_ENV === "production" ? "/FM-Portfolio" : "";

export function createImagePath(
    category: string,
    projectId: string,
    imageName: string
): string {
    // Ensure all parts are properly encoded and add basePath in production
    const encodedProjectId = encodeURIComponent(projectId);
    const encodedImageName = encodeURIComponent(decodeURIComponent(imageName)); // decode first in case it's already encoded

    return `${basePath}/categories/${category}/${encodedProjectId}/images/${encodedImageName}`;
}

// Optional: Helper function for other static assets
export function createStaticPath(path: string): string {
    return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
