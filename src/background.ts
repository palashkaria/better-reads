import { RunData } from "./Action.types";
import {
  addDataToCurrentRun,
  finishCurrentRun,
  getAllRunsInitialValue,
  getCurrentRun,
} from "./actionUtils";

/**
 * This code uses the background page to maintain sanity in runs
 * **currently this picks the last run**
 * this prevents issues with triggering runs without the user clicking 'run' (on page landing)
 *
 * In the future, this could be modified to choose between UX patterns
 * eg
 * - only one run per-website at a time
 * - multiple parallel runs at a time with sanity checks
 * - show lists of runs
 * - sync runs (could be an API call to a server with some IDs, or use of chrome.storage.sync)
 * */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    /**
     * getCurrentCountStatus
     * This action is triggered from the content script,
     * sends back the **last run** data to the script from chrome.storage
     */
    case "getCurrentCountStatus":
      chrome.storage.local.get("countStatus", (currentCountStatus) => {
        console.log("currentCountStatus", currentCountStatus);
        sendResponse(currentCountStatus);
      });
      /**
       * without this "return true",
       * the content script will not receive the response
       * https://stackoverflow.com/a/20077854
       *  */
      return true;

    /**
     * toggleCount
     */
    case "toggleCount":
      chrome.storage.local.get("countStatus", async (currentCountStatus) => {
        const newCountStatus = !currentCountStatus.countStatus;
        console.log("setting status", currentCountStatus, newCountStatus);
        chrome.storage.local.set({
          countStatus: newCountStatus,
        });
        const [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true,
        });

        tab.id && chrome.tabs.sendMessage(tab.id, "showCount");
      });
      return true;
    default:
      return true;
  }
});

function keepAlive() {
  setTimeout(keepAlive, 1000 * 30);
}
keepAlive();
