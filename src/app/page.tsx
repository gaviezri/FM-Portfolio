import HomeCarousel from "@/components/topBar/HomeCarousel";
import Logo from "@/components/topBar/Logo";
import { getProjectsForCategory } from "@/utils/projects";
import { Slide } from "@/types";

export default async function HomePage() {
    // Get featured projects from both categories
    const residentialProjects = await getProjectsForCategory("residential");
    const commercialProjects = await getProjectsForCategory("commercial");

    const carouselSlides = [
        ...residentialProjects.map((project) => ({
            ...project,
            category: "residential",
        })),
        ...commercialProjects.map((project) => ({
            ...project,
            category: "commercial",
        })),
    ];

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 relative">
                <HomeCarousel
                    slides={carouselSlides.map((prjctInfo) => {
                        return {
                            id: prjctInfo.id,
                            category: prjctInfo.category,
                            title: prjctInfo.title,
                            thumbnail: prjctInfo.thumbnail,
                        } as Slide;
                    })}
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-800">
                        <Logo />
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-neutral-600">
                        Architecture & Interior Design
                    </p>
                </div>
            </div>
        </div>
    );
}
