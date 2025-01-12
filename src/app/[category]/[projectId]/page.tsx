import { getProject, getAllProjects } from "@/utils/projects";
import ProjectPage from "@/components/ProjectPage";
import { Metadata } from "next";

interface ProjectPageProps {
    params: Promise<{
        category: string;
        projectId: string;
    }>;
}

export async function generateStaticParams() {
    const allProjects = await getAllProjects();
    return allProjects.map((project) => ({
        category: project.category,
        projectId: project.id,
    }));
}

export async function generateMetadata({
    params,
}: ProjectPageProps): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    try {
        const project = await getProject(
            resolvedParams.category,
            resolvedParams.projectId
        );

        return {
            title: project.title,
            description: project.description,
        };
    } catch (error) {
        console.log(error);
        return {
            title: "Project Not Found",
        };
    }
}

export default async function Page({ params }: ProjectPageProps) {
    const resolvedParams = await Promise.resolve(params);
    const project = await getProject(
        resolvedParams.category,
        resolvedParams.projectId
    );

    return <ProjectPage project={project} />;
}
