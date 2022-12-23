import React from "react";
import ReactDOM from "react-dom";
import { useChromeStorageLocal } from "use-chrome-storage";
const Popup = () => {
  const openPage = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    tab.id && chrome.tabs.sendMessage(tab.id, "toggleCount");
  };
  const [countStatus] = useChromeStorageLocal("countStatus", true);
  console.log({ countStatus });
  return (
    <>
      <button onClick={openPage} style={{ marginRight: "5px" }}>
        {countStatus ? "Hide count" : "Show count"}
      </button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
