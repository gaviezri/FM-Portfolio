"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

interface ImageItem {
    src: string;
    alt: string;
    width: number;
    height: number;
}

interface ImageGridProps {
    initialImages: ImageItem[];
    loadMore: () => Promise<ImageItem[]>;
}

export default function ImageGrid({ initialImages, loadMore }: ImageGridProps) {
    const [images, setImages] = useState<ImageItem[]>(initialImages);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });

    useEffect(() => {
        const loadMoreImages = async () => {
            if (inView && !loading && hasMore) {
                setLoading(true);
                try {
                    const newImages = await loadMore();
                    if (newImages.length === 0) {
                        setHasMore(false);
                    } else {
                        setImages((prev) => [...prev, ...newImages]);
                    }
                } catch (error) {
                    console.error("Error loading more images:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadMoreImages();
    }, [inView, loading, hasMore, loadMore]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {images.map((image, index) => (
                <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg"
                >
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            ))}
            {hasMore && (
                <div
                    ref={ref}
                    className="col-span-full h-20 flex items-center justify-center"
                >
                    {loading && (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    )}
                </div>
            )}
        </div>
    );
}
