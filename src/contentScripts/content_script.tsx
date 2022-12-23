import { hideCount, showCount } from "./utils";

window.addEventListener("load", () => {
  console.log(
    "Content script loaded. This message is logged from src/contentScripts/content_script.tsx"
  );
  // add a new column to the table
  // append before last th in thead
  const theadRow = document.querySelector("thead tr");
  const th = document.createElement("th");
  th.textContent = "Genres";
  theadRow?.insertBefore(th, theadRow.lastElementChild);

  const trs = document.querySelectorAll("tbody tr");
  // get all a hrefs inside tds
  trs.forEach(async (tr) => {
    await addGenresToRow(tr);
  });
  // use mutation observer to add genres to new rows
  const observer = new MutationObserver((mutations) => {
    console.log("mutations", mutations);
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        console.log("mutation", mutation.addedNodes);
        mutation.addedNodes.forEach(async (node) => {
          if (node.nodeName === "TR") {
            await addGenresToRow(node as Element);
          }
        });
      }
    });
  });
  const tbody = document.querySelector("tbody#booksBody");
  tbody &&
    observer.observe(tbody, {
      childList: true,
      subtree: true,
    });
});

const addGenresToRow = async (tr: Element) => {
  const anchor = tr.querySelector("td.title a");
  const link = anchor?.getAttribute("href");
  if (link) {
    const html = await (await fetch(link)).text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const genres = [
      ...doc.querySelectorAll(".BookPageMetadataSection__genreButton"),
    ].map((genre) => {
      const genreName = genre.textContent;
      return genreName;
    });
    const td = document.createElement("td");
    td.classList.add("genres");
    // set font size to 12px
    td.style.fontSize = "12px";
    // set padding to 6px 0px
    td.style.padding = "6px 0px";
    td.textContent = genres.join(", ");
    tr.insertBefore(td, tr.lastElementChild);
  }
};
