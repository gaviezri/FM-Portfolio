import { ProjectInfo } from "@/types";

interface ProjectHeaderProps {
    project: ProjectInfo;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {project.title}
            </h1>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                    <span className="font-medium text-gray-900">Location</span>
                    <p className="mt-1 text-gray-500">{project.location}</p>
                </div>
                <div>
                    <span className="font-medium text-gray-900">Year</span>
                    <p className="mt-1 text-gray-500">{project.year}</p>
                </div>
                {project.area && (
                    <div>
                        <span className="font-medium text-gray-900">Area</span>
                        <p className="mt-1 text-gray-500">{project.area}</p>
                    </div>
                )}
            </div>
            <p className="mt-6 text-lg leading-8 text-gray-600">
                {project.description}
            </p>
        </div>
    );
}
