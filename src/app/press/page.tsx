import { PressCard } from "@/components/press/PressCard";
import { collectPressPublications } from "@/utils/press";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Press | Florencia Michelli",
    description:
        "Press coverage and publications featuring Florencia Michelli's architectural work",
};

export default async function PressPage() {
    const publications = await collectPressPublications();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl mx-auto mb-12 text-center">
                {/* <h1 className="text-4xl font-light mb-4">Press</h1> */}
                <p className="text-gray-600">
                    Selected articles and features about my work in
                    architectural publications and media.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {publications.map((publication, index) => (
                    <PressCard key={index} publication={publication} />
                ))}
            </div>
        </div>
    );
}
