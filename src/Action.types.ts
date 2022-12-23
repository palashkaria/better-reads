export type Stock = {
  name: string | null;
  change: string | null;
  time: number;
};

export type RunData = {
  id: number;
  status: "init" | "scraped" | "submitted";
  stocksData: Stock;
};
