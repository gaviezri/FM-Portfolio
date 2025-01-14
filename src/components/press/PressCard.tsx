import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { PublicationInfo } from "@/types";

interface PressCardProps {
    publication: PublicationInfo;
}

export const PressCard = ({ publication }: PressCardProps) => {
    return (
        <div className="group relative bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
            >
                {publication.thumbnail && (
                    <div className="relative h-48 overflow-hidden">
                        <Image
                            src={publication.thumbnail}
                            alt={publication.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                )}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">
                            {publication.outlet}
                        </span>
                        <span className="text-sm text-gray-400">
                            {publication.date}
                        </span>
                    </div>
                    <h3 className="text-xl font-medium mb-2 pr-6 group-hover:text-gray-600 transition-colors">
                        {publication.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                        {publication.description}
                    </p>
                    <div className="flex items-center text-gray-500 text-sm group-hover:text-gray-700">
                        Read More
                        <ExternalLink className="ml-1 h-4 w-4" />
                    </div>
                </div>
            </a>
        </div>
    );
};
