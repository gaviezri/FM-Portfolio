import { ProjectInfo } from "@/types";

interface ProjectFeedProps {
    index: number;
    category: string;
    project: ProjectInfo;
    navigate: (route: string) => void;
    columnIndex: number;
    isPositionedMiddle: boolean;
}

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

const ProjectCard = ({
    project,
    category,
    navigate,
    columnIndex,
    isPositionedMiddle,
}: ProjectFeedProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const { ref, inView } = useInView({
        threshold: 0.2,
        triggerOnce: true,
    });

    useEffect(() => {
        if (inView) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, columnIndex * 200); // 200ms delay between each column
            return () => clearTimeout(timer);
        }
    }, [inView, columnIndex]);

    return (
        <div
            ref={ref}
            className={`relative aspect-[3/4] cursor-pointer group transform 
                        transition-all duration-700 ease-out
                        ${isPositionedMiddle ? "md:translate-y-12" : ""}
                        ${
                            isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-32 opacity-0"
                        }
            `}
            onClick={() => navigate(`/${category}/${project.id}`)}
        >
            <Image
                priority
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
};

export default ProjectCard;
