import { ProjectInfo } from "@/types";
import { getCardPosition, isLastRow } from "@/utils/feed";
import React from "react";
import ProjectCard from "./ProjectCard";

interface ProjectCardWrapperProps {
    index: number;
    totalDisplayedProjects: number;
    totalColumns: number;
    category: string;
    project: ProjectInfo;
}

const ProjectCardWrapper = ({
    index,
    totalDisplayedProjects,
    totalColumns,
    category,
    project,
}: ProjectCardWrapperProps) => {
    const cardPosition = getCardPosition(
        index,
        totalDisplayedProjects,
        totalColumns
    );
    const lastRow = isLastRow(index, totalDisplayedProjects, totalColumns);
    const columnIndex = index % totalColumns;

    // Check if this is first card in a two-card last row
    const isTwoCardLastRow =
        lastRow && totalDisplayedProjects % totalColumns === 2;
    const isFirstCardInTwoCardRow =
        isTwoCardLastRow && index === totalDisplayedProjects - 2;

    return (
        <React.Fragment key={`${category}-${project.id}-${index}`}>
            <div className={cardPosition}>
                <ProjectCard
                    project={project}
                    index={index}
                    category={category}
                    columnIndex={columnIndex}
                    isPositionedMiddle={
                        (columnIndex === 1 && !lastRow) ||
                        (lastRow && cardPosition === "col-start-2")
                    }
                />
            </div>
            {isFirstCardInTwoCardRow && (
                <div className="col-start-2" aria-hidden="true" />
            )}
        </React.Fragment>
    );
};

export default ProjectCardWrapper;
