import { useMemo } from "react";
import { Search, ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";
import { Button } from "@/renderer/components/ui/button";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import { Separator } from "@/renderer/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";
import { cn } from "@/renderer/lib/utils";
import {
  useCardViewReducer,
  calculateOrderTotals,
} from "./hooks/useCardViewReducer";
import {
  mockCategories,
  mockProducts,
  mockCustomers,
  formatCurrency,
  filterProducts,
  getStockStatus,
} from "./sale-data";

function CardView() {
  const { state, activeOrder, actions } = useCardViewReducer();

  const filteredProducts = useMemo(
    () =>
      filterProducts(mockProducts, state.searchQuery, state.selectedCategory),
    [state.searchQuery, state.selectedCategory],
  );

  const totals = useMemo(
    () => calculateOrderTotals(activeOrder.items),
    [activeOrder.items],
  );

  return (
    <div className="flex h-full gap-2">
      {/* Left Side - Products */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Row 1: Orders */}
        <div className="flex items-center gap-2 mb-2 shrink-0">
          {/* Orders - Scrollable */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1">
            {state.orders.map((order) => (
              <button
                key={order.id}
                onClick={() => actions.setActiveOrder(order.id)}
                className={cn(
                  "cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap text-sm",
                  state.activeOrderId === order.id
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "bg-card border-border hover:bg-muted",
                )}
              >
                <span className="font-medium">{order.name}</span>
                <span className="text-xs opacity-70">
                  ({order.items.length})
                </span>
                {state.orders.length > 1 && (
                  <X
                    className="w-3 h-3 opacity-70 hover:opacity-100 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      actions.deleteOrder(order.id);
                    }}
                  />
                )}
              </button>
            ))}
          </div>
          {/* New Order Button - Fixed */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => actions.addOrder()}
            className="shrink-0"
          >
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>

        {/* Category Bar */}
        <div className="flex gap-2 mb-2 overflow-x-auto pb-1 shrink-0">
          {mockCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => actions.setCategory(category.id)}
              className={cn(
                "cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition-all whitespace-nowrap text-xs font-medium",
                state.selectedCategory === category.id
                  ? "bg-secondary text-secondary-foreground border-secondary"
                  : "bg-card border-border hover:bg-muted",
              )}
            >
              <span className="text-sm">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-2 shrink-0 mx-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={state.searchQuery}
            onChange={(e) => actions.setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto pb-1">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <button
                  key={product.id}
                  onClick={() => actions.addItem(product)}
                  disabled={product.stock === 0}
                  className={cn(
                    "cursor-pointer flex flex-col p-3 rounded-lg border bg-card hover:bg-muted transition-all text-left",
                    product.stock === 0 && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <div className="text-3xl mb-2">{product.image}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 leading-snug">
                      {product.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {product.sku}
                    </p>
                    {/* Stock Indicator */}
                    <p
                      className={cn(
                        "text-[10px] mt-1 font-medium",
                        stockStatus.color,
                      )}
                    >
                      {stockStatus.label}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-base text-primary">
                      Rs. {product.price}
                    </span>
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center",
                        product.stock > 0
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="w-72 sm:w-80 md:w-80 lg:w-84 xl:w-96 flex flex-col bg-card border-l h-full overflow-hidden shrink-0">
        {/* Customer Select */}
        <div className="p-2 border-b shrink-0">
          <Label className="text-xs text-muted-foreground mb-1 block">
            Customer
          </Label>
          <Select
            value={activeOrder.customer?.id || "1"}
            onValueChange={(val) => actions.setCustomer(val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockCustomers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  <div className="font-medium">{customer.name}</div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {activeOrder.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingCart className="w-8 h-8 mb-1 opacity-20" />
              <p className="text-xs">Cart empty</p>
            </div>
          ) : (
            activeOrder.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-2 p-1.5 rounded-md bg-muted/50"
              >
                <div className="text-lg">{item.image}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-xs truncate">{item.name}</h4>
                  <p className="text-[10px] text-muted-foreground">
                    {formatCurrency(item.price)}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => actions.decrementItem(item.id)}
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        actions.updateItem(item.id, "quantity", e.target.value)
                      }
                      className="w-10 h-5 text-center text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => actions.incrementItem(item.id)}
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-destructive"
                    onClick={() => actions.removeItem(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                  <span className="font-bold text-xs">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary */}
        <div className="p-2 border-t bg-muted/30 space-y-0.5 shrink-0">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(totals.subTotal)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Tax (18%)</span>
            <span>{formatCurrency(totals.taxTotal)}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between font-bold text-sm">
            <span>Total</span>
            <span className="text-base">
              {formatCurrency(totals.grandTotal)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-2 border-t flex gap-2 shrink-0">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => actions.clearOrder()}
          >
            Cancel
          </Button>
          <Button className="flex-1" disabled={activeOrder.items.length === 0}>
            Complete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CardView;
