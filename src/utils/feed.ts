import { ProjectInfo } from "@/types";

export function isLastRow(
    index: number,
    displayedProjectsLength: number,
    totalColumns: number
): boolean {
    return (
        index >=
        displayedProjectsLength - (displayedProjectsLength % totalColumns)
    );
}

export function getCardPosition(
    index: number,
    displayedProjects: ProjectInfo[],
    totalColumns: number
): string {
    const remainingInLastRow = displayedProjects.length % totalColumns;

    if (
        isLastRow(index, displayedProjects.length, totalColumns) &&
        remainingInLastRow > 0
    ) {
        if (remainingInLastRow === 1) {
            // Single card in last row - center it
            return "col-start-2";
        } else if (remainingInLastRow === 2) {
            // Two cards in last row - place them on the edges
            const positionInLastRow =
                index - (displayedProjects.length - remainingInLastRow);
            return positionInLastRow === 0 ? "col-start-1" : "col-start-3";
        }
    }
    return "";
}
