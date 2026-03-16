import { useState } from "react";
import { Grid3X3, List } from "lucide-react";
import { Button } from "@/renderer/components/ui/button";
import CardView from "./CardView";
import TableView from "./TableView";

export default function CreateSaleInvoice() {
  const [viewMode, setViewMode] = useState("card");

  return (
    <div className="h-full p-3 overflow-hidden flex flex-col">
      {/* View Toggle - Only in header */}
      <div className="flex items-center gap-1 bg-muted rounded-lg p-1 mb-3 w-fit shrink-0">
        <Button
          variant={viewMode === "card" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("card")}
        >
          <Grid3X3 className="w-4 h-4 mr-1" />
          Card
        </Button>
        <Button
          variant={viewMode === "table" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("table")}
        >
          <List className="w-4 h-4 mr-1" />
          Table
        </Button>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "card" ? <CardView /> : <TableView />}
      </div>
    </div>
  );
}
