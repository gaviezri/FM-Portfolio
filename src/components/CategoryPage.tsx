"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProjectCarousel from "@/components/ProjectsCarousel";
import ImageGrid from "@/components/ImageGrid";
import { ProjectInfo } from "@/types";

interface CategoryPageProps {
    initialProjects: ProjectInfo[];
}

export default function CategoryPage({ initialProjects }: CategoryPageProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [projects] = useState(initialProjects);
    const [selectedProject, setSelectedProject] = useState<string>("");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [projectImages, setProjectImages] = useState<any[]>([]);
    const [projectDetails, setProjectDetails] = useState<ProjectInfo | null>(
        null
    );

    // Initialize with URL project or first project
    useEffect(() => {
        const projectFromUrl = searchParams.get("project");
        if (projectFromUrl && projects.some((p) => p.id === projectFromUrl)) {
            setSelectedProject(projectFromUrl);
        } else if (projects.length > 0 && !selectedProject) {
            setSelectedProject(projects[0].id);
            // Update URL with default project
            router.replace(`?project=${projects[0].id}`, { scroll: false });
        }
    }, [projects, searchParams, router, selectedProject]);

    // Load project data when selection changes
    useEffect(() => {
        const loadProjectData = async () => {
            if (!selectedProject) return;

            try {
                const selectedProjectData = projects.find(
                    (p) => p.id === selectedProject
                );
                if (selectedProjectData) {
                    setProjectDetails(selectedProjectData);
                    setProjectImages(selectedProjectData.images || []);
                }
            } catch (error) {
                console.error("Error loading project data:", error);
            }
        };

        loadProjectData();
    }, [selectedProject, projects]);

    const handleProjectSelect = (projectId: string) => {
        setSelectedProject(projectId);
        // Update URL without page reload
        router.replace(`?project=${projectId}`, { scroll: false });
    };

    const loadMoreImages = async () => {
        // Implement pagination logic here if needed
        return [];
    };

    return (
        <div className="min-h-screen bg-white">
            <ProjectCarousel
                projects={projects}
                selectedProject={selectedProject}
                onProjectSelect={handleProjectSelect}
            />

            {projectImages.length > 0 && (
                <ImageGrid
                    initialImages={projectImages}
                    loadMore={loadMoreImages}
                />
            )}

            {projectDetails && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {projectDetails.title}
                    </h2>
                    <div className="prose max-w-none">
                        <p className="text-gray-600">
                            {projectDetails.description}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div>
                                <dt className="font-medium text-gray-900">
                                    Location
                                </dt>
                                <dd className="text-gray-600">
                                    {projectDetails.location}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-medium text-gray-900">
                                    Year
                                </dt>
                                <dd className="text-gray-600">
                                    {projectDetails.year}
                                </dd>
                            </div>
                            {projectDetails.area && (
                                <div>
                                    <dt className="font-medium text-gray-900">
                                        Area
                                    </dt>
                                    <dd className="text-gray-600">
                                        {projectDetails.area}
                                    </dd>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
