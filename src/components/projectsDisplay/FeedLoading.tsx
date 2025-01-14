import React from "react";

interface FeedLoaderProps {
    projectsPerPage: number;
}

const FeedLoading = ({ projectsPerPage }: FeedLoaderProps) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {[...Array(projectsPerPage)].map((_, index) => (
                    <div
                        key={index}
                        className="aspect-[3/4] bg-gray-100 animate-pulse"
                    />
                ))}
            </div>
        </div>
    );
};

export default FeedLoading;
