"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { ProjectInfo } from "@/types";

interface ProjectFeedProps {
    category: string;
    projects: ProjectInfo[];
}

export default function ProjectFeed({ category, projects }: ProjectFeedProps) {
    const router = useRouter();
    const [displayedProjects, setDisplayedProjects] = useState<ProjectInfo[]>(
        []
    );
    const [page, setPage] = useState(1);
    const projectsPerPage = 6;

    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });

    useEffect(() => {
        if (inView) {
            const start = (page - 1) * projectsPerPage;
            const end = start + projectsPerPage;
            const newProjects = projects.slice(start, end);

            if (newProjects.length > 0) {
                setDisplayedProjects((prev) => [...prev, ...newProjects]);
                setPage((prev) => prev + 1);
            }
        }
    }, [inView, page, projects]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {displayedProjects.map((project, index) => {
                    // Create a unique key using project ID and index
                    const projectKey = `${category}-${project.id}-${index}`;
                    return (
                        <div
                            key={projectKey}
                            className={`relative aspect-[3/4] cursor-pointer group
                                ${index % 3 === 1 ? "md:translate-y-12" : ""}`}
                            onClick={() =>
                                router.push(`/${category}/${project.id}`)
                            }
                        >
                            <Image
                                src={project.thumbnail}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="text-center px-4">
                                    <h3 className="text-white text-xl font-medium">
                                        {project.title}
                                    </h3>
                                    <p className="text-white text-sm mt-2">
                                        {project.location} | {project.year}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {displayedProjects.length < projects.length && (
                <div
                    ref={ref}
                    className="h-20 flex items-center justify-center"
                >
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
            )}
        </div>
    );
}
