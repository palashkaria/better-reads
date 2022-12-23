let HIDDEN_ELEMENTS = [] as Array<HTMLElement | null>;

export const hideCount = () => {
  const element = document.querySelector("body");
  const options = {
    childList: true, // listen to children being added or removed
    subtree: true, // omit or set to false to observe only changes to the parent node
  };

  const callback: MutationCallback = (mutationList, observer) => {
    mutationList.forEach((mutation) => {
      switch (mutation.type) {
        case "childList":
          const addedNodes = [...mutation.addedNodes];
          // find nodes with data-testid="cellInnerDiv"
          const cellInnerDivs = addedNodes.filter((node) => {
            const newDiv = node as HTMLDivElement;
            return newDiv.getAttribute("data-testid") === "cellInnerDiv";
          });
          if (cellInnerDivs.length > 0) {
            runHideCount(cellInnerDivs[0] as HTMLElement);
          }
          break;
      }
    });
  };

  window.countObserver = new MutationObserver(callback);
  hideInitial();
  element && window.countObserver.observe(element, options);
};

const hideInitial = () => {
  const cellInnerDivs = [
    ...document.querySelectorAll("div[data-testid='cellInnerDiv']"),
  ];
  console.log("hide initial", { cellInnerDivs });
  cellInnerDivs.forEach((cellInnerDiv) => {
    runHideCount(cellInnerDiv as HTMLElement);
  });
};
const runHideCount = (cellInnerDiv: HTMLElement) => {
  // get all the analytics anchors from cellInnerDivs
  const analyticsAnchors = [...cellInnerDiv.querySelectorAll("article a")]
    .map((a) => {
      const newA = a as HTMLAnchorElement;
      if (
        newA.href.endsWith("analytics") &&
        newA.querySelector("svg path")?.getAttribute("d") ===
          "M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"
      ) {
        return newA;
      }
      return false;
    })
    .filter(Boolean) as Array<HTMLAnchorElement>;
  const analyticsAnchorDivs = analyticsAnchors.map((a) => a?.parentElement);
  analyticsAnchorDivs.forEach((div) => {
    div?.setAttribute("style", "display: none");
  });
  HIDDEN_ELEMENTS = [...HIDDEN_ELEMENTS, ...analyticsAnchorDivs];
};

export const showCount = () => {
  console.log("show count!");
  window.countObserver?.disconnect();
  HIDDEN_ELEMENTS.forEach((el) => {
    (el as HTMLDivElement)?.setAttribute("style", "display: flex");
  });
};
