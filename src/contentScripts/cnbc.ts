import { Stock } from "../Action.types";

export const executeCNBCAction = () => {
  if (!window.location.href.includes("cnbc.com")) {
    return;
  }
  const tabs = [...document.querySelectorAll(".MarketMoversMenu-marketOption")];
  const nasdaqTab = tabs.filter(
    (tab) => tab.textContent === "NASDAQ"
  )[0] as HTMLElement;
  window.setTimeout(() => {
    executeNasdaq(nasdaqTab);
  }, 1500);
};
const findTable = () => {
  const table = document.querySelector(".MarketTop-topTable");
  return table;
};

const executeNasdaq = (tab: HTMLElement) => {
  tab.click();
  window.setTimeout(() => {
    const table = findTable();
    if (table) {
      const stocksData = findTableData(table);
      if (stocksData) {
        chrome.runtime.sendMessage({ type: "runFormAction", stocksData });
      }
    }
  }, 1000);
};

const findTableData = (table: Element): Stock | undefined => {
  const tableTitle = table?.previousSibling;
  if (tableTitle?.textContent === "TOP GAINERS") {
    const rows = [...table?.querySelectorAll("tr")];
    const secondRow = rows[1];
    const secondRowCells = [...secondRow.querySelectorAll("td")];
    const secondRowName = secondRowCells[1].textContent;
    const secondRowChange = secondRowCells[3].textContent;
    const date = new Date();
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    return {
      name: secondRowName,
      change: secondRowChange,
      time: unixTimestamp,
    };
  }
};
