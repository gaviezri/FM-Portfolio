"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Slide } from "@/types";

interface HomeCarouselProps {
    slides: Slide[];
}

export default function HomeCarousel({ slides }: HomeCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const router = useRouter();

    useEffect(() => {
        // Auto-advance slides
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const previousSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleImageClick = () => {
        const slide = slides[currentSlide];
        router.push(`/${slide.category}?project=${slide.id}`);
    };

    return (
        <div className="relative h-full overflow-hidden">
            {/* Carousel images */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 cursor-pointer
            ${
                index === currentSlide
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
            }`}
                    onClick={handleImageClick}
                >
                    <Image
                        src={slide.thumbnailUrl}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                </div>
            ))}

            {/* Navigation arrows */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    previousSlide();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            goToSlide(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all
                ${
                    index === currentSlide
                        ? "bg-white w-4"
                        : "bg-white/60 hover:bg-white/80"
                }`}
                    />
                ))}
            </div>
        </div>
    );
}
