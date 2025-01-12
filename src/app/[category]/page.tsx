import { getProjectsForCategory } from "@/utils/projects";
import ProjectFeed from "@/components/ProjectsFeed";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ category: string }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const category = resolvedParams.category.toLowerCase();

    return {
        title: `${
            category.charAt(0).toUpperCase() + category.slice(1)
        } Projects`,
    };
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = await Promise.resolve(params);
    const category = resolvedParams.category.toLowerCase();
    const projects = await getProjectsForCategory(category);

    return <ProjectFeed category={category} projects={projects} />;
}
