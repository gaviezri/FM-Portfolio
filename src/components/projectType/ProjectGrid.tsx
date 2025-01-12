"use client";
import Link from "next/link";
import Image from "next/image";
import { ProjectInfo } from "../../types";

interface ProjectGridProps {
    category: string;
    projects: ProjectInfo[];
}

export default function ProjectGrid({ category, projects }: ProjectGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {projects.map((project) => (
                <Link
                    key={project.id}
                    href={`/${category}/${project.id}`}
                    className="group"
                >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                        <Image
                            src={project.thumbnail}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                        {project.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {project.location} | {project.year}
                    </p>
                </Link>
            ))}
        </div>
    );
}
