interface CategoryHeaderProps {
    title: string;
    description?: string;
}

export default function CategoryHeader({
    title,
    description,
}: CategoryHeaderProps) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {title}
            </h1>
            {description && (
                <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
                    {description}
                </p>
            )}
        </div>
    );
}
