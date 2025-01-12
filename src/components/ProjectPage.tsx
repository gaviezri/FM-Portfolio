"use client";
import { useState } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { ProjectInfo } from "@/types";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectPageProps {
    project: ProjectInfo;
}

export default function ProjectPage({ project }: ProjectPageProps) {
    const router = useRouter();
    const [displayCount, setDisplayCount] = useState(12);
    const imagesPerLoad = 6;

    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });

    // Load more images when the sentinel element comes into view
    if (inView && displayCount < project.images.length) {
        setDisplayCount((prev) =>
            Math.min(prev + imagesPerLoad, project.images.length)
        );
    }
    return (
        <div className="min-h-screen bg-white">
            {/* Back button */}
            <button
                onClick={() => router.back()}
                className="fixed top-24 left-4 z-10 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Project header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                    {project.title}
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl">
                    {project.description}
                </p>

                {/* Project details */}
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">
                            Location
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {project.location}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">
                            Year
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {project.year}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">
                            Area
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {project.area}
                        </dd>
                    </div>
                </div>
            </div>

            {/* Image grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.images
                        .slice(0, displayCount)
                        .map((image, index) => (
                            <div
                                key={`${project.id}-${index}`}
                                className={`relative aspect-[3/4] ${
                                    index % 3 === 1 ? "md:translate-y-12" : ""
                                }`}
                            >
                                <Image
                                    src={image}
                                    alt={"project photo"}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        ))}
                </div>

                {/* Load more sentinel */}
                {displayCount < project.images.length && (
                    <div
                        ref={ref}
                        className="h-20 flex items-center justify-center mt-8"
                    >
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    </div>
                )}
            </div>
        </div>
    );
}
