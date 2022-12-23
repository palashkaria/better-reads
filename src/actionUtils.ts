import { RunData, Stock } from "./Action.types";

/**
 *
 * @param allRuns Array
 * @returns the last item in `allRuns` array
 */
export const getCurrentRun = (allRuns: RunData[]) => {
  return allRuns[allRuns.length - 1];
};

/**
 * @param allRuns Array
 * @param stocksData `Stock` object
 * @returns `allRuns` array with `stocksData` added to current run
 * */
export const addDataToCurrentRun = (allRuns: RunData[], stocksData: Stock) => {
  const currentRun = getCurrentRun(allRuns);
  return [
    ...allRuns.slice(0, -1),
    { ...currentRun, status: "scraped", stocksData },
  ];
};

/**
 *
 * @param allRuns Array
 * @returns `allRuns` with current run status updated to `submitted`
 */
export const finishCurrentRun = (allRuns: RunData[]) => {
  const currentRun = getCurrentRun(allRuns);
  return [...allRuns.slice(0, -1), { ...currentRun, status: "submitted" }];
};

export const getAllRunsInitialValue = (allRuns: RunData[] | undefined) => {
  if (!allRuns) {
    return [{ id: 1, status: "init" }];
  } else {
    const id = allRuns.length;
    return [...allRuns, { id, status: "init" }];
  }
};
