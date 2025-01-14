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
    totalProjectsDisplayed: number,
    totalColumns: number
): string {
    const remainingInLastRow = totalProjectsDisplayed % totalColumns;
    const isInLastRow = isLastRow(index, totalProjectsDisplayed, totalColumns);

    if (isInLastRow && remainingInLastRow > 0) {
        if (remainingInLastRow === 1) {
            // Single card in last row - center it
            return "col-start-2";
        } else if (remainingInLastRow === 2) {
            // Two cards in last row - place them with one column gap between
            const positionInLastRow =
                index - (totalProjectsDisplayed - remainingInLastRow);

            // First card starts at column 1, second card starts at column 3
            return positionInLastRow === 0 ? "col-start-1" : "col-start-3";
        }
    }
    return "";
}
