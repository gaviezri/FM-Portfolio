// components/ProjectImage.tsx
import Image from "next/image";
import { createStaticPath } from "@/utils/paths";

interface ProjectImageProps {
    src: string;
    alt: string;
    className?: string;
    fill?: boolean;
    width?: number;
    height?: number;
    sizes?: string;
}

export function ProjectImage({
    src,
    alt,
    className,
    fill,
    width,
    height,
    sizes,
}: ProjectImageProps) {
    // Ensure the src path is correct for both development and production
    const imageSrc = src.startsWith("http") ? src : createStaticPath(src);

    return (
        <Image
            src={imageSrc}
            alt={alt}
            className={className}
            fill={fill}
            width={width}
            height={height}
            sizes={sizes}
            unoptimized // Since we're using static export
        />
    );
}
