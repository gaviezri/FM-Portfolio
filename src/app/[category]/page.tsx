import { getProjectsForCategory } from "@/utils/projects";
import CategoryPage from "@/components/CategoryPage";
import { Metadata } from "next";

interface PageProps {
    params: {
        category: string;
    };
}

// Optional: Generate metadata for the page
export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    return {
        title: `${
            params.category.charAt(0).toUpperCase() + params.category.slice(1)
        } Projects`,
    };
}

export default async function Page({
    params,
}: {
    params: { category: string };
}) {
    // Validate category parameter
    const validCategories = ["residential", "commercial"];
    const category = validCategories.includes(params.category.toLowerCase())
        ? params.category.toLowerCase()
        : "residential"; // Default fallback

    const projects = await getProjectsForCategory(category);

    return <CategoryPage initialProjects={projects} />;
}

// Add type safety for valid category paths
export function generateStaticParams() {
    return [{ category: "residential" }, { category: "commercial" }];
}
