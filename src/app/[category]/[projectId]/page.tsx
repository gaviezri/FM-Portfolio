import { getProject } from "@/utils/projects";
import ProjectPage from "@/components/ProjectPage";
import { Metadata } from "next";

interface ProjectPageProps {
    params: Promise<{
        category: string;
        projectId: string;
    }>;
}

export async function generateMetadata({
    params,
}: ProjectPageProps): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const project = await getProject(
        resolvedParams.category,
        resolvedParams.projectId
    );

    return {
        title: project.title,
        description: project.description,
    };
}

export default async function Page({ params }: ProjectPageProps) {
    const resolvedParams = await Promise.resolve(params);
    const project = await getProject(
        resolvedParams.category,
        resolvedParams.projectId
    );

    return <ProjectPage project={project} />;
}
