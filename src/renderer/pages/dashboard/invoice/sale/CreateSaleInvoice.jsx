import { useState } from "react";
import CardView from "./CardView";
import TableView from "./TableView";

export default function CreateSaleInvoice() {
  const [viewMode, setViewMode] = useState("card");

  return (
    <div className="h-full flex flex-col">
      {/* View Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "card" ? (
          <CardView viewMode={viewMode} setViewMode={setViewMode} />
        ) : (
          <TableView viewMode={viewMode} setViewMode={setViewMode} />
        )}
      </div>
    </div>
  );
}
