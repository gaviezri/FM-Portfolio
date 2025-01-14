"use client";
import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useMount } from "@/hooks/UseMount";
import FeedLoading from "./FeedLoading";
import { ProjectInfo } from "@/types";
import ProjectCardWrapper from "./ProjectCardWrapper";

interface ProjectFeedProps {
    category: string;
    projects: ProjectInfo[];
}

const ProjectFeed = ({ category, projects }: ProjectFeedProps) => {
    const [displayedProjects, setDisplayedProjects] = useState<ProjectInfo[]>(
        []
    );
    const [page, setPage] = useState(1);
    const projectsPerPage = 6;
    const totalColumns = 3;
    const isMounted = useMount();

    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });

    useEffect(() => {
        if (!isMounted) return;

        if (inView) {
            const start = (page - 1) * projectsPerPage;
            const end = start + projectsPerPage;
            const newProjects = projects.slice(start, end);

            if (newProjects.length > 0) {
                setDisplayedProjects((prev) => [...prev, ...newProjects]);
                setPage((prev) => prev + 1);
            }
        }
    }, [inView, page, projects, isMounted]);

    // Initial load
    useEffect(() => {
        if (!isMounted) return;

        const initialProjects = projects.slice(0, projectsPerPage);
        setDisplayedProjects(initialProjects);
    }, [projects, isMounted]);

    if (!isMounted) {
        return <FeedLoading projectsPerPage={projectsPerPage} />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {displayedProjects.map((project, index) => (
                    <ProjectCardWrapper
                        key={index}
                        project={project}
                        index={index}
                        totalDisplayedProjects={displayedProjects.length}
                        totalColumns={totalColumns}
                        category={category}
                    />
                ))}
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
};

export default ProjectFeed;
