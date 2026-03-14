import { useState } from "react";
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  X,
  Grid3X3,
  List,
  User,
  ArrowLeft,
  ArrowRight,
  Receipt,
  Save,
} from "lucide-react";
import { Button } from "@/renderer/components/ui/button";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import { Card, CardContent } from "@/renderer/components/ui/card";
import { Separator } from "@/renderer/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";
import { cn } from "@/renderer/lib/utils";

const mockCategories = [
  { id: "all", name: "All Products", icon: "📦" },
  { id: "food", name: "Food & Beverages", icon: "🍔" },
  { id: "drinks", name: "Drinks", icon: "🥤" },
  { id: "snacks", name: "Snacks", icon: "🍿" },
  { id: "dairy", name: "Dairy", icon: "🥛" },
  { id: "frozen", name: "Frozen", icon: "🧊" },
];

const mockProducts = [
  { id: "1", name: "Chicken Biryani", sku: "FOOD-001", price: 350, taxRate: 18, category: "food", image: "🍚" },
  { id: "2", name: "Beef Pulao", sku: "FOOD-002", price: 400, taxRate: 18, category: "food", image: "🍲" },
  { id: "3", name: "Chicken Karahi", sku: "FOOD-003", price: 1200, taxRate: 18, category: "food", image: "🍗" },
  { id: "4", name: "Seekh Kabab (4 pcs)", sku: "FOOD-004", price: 450, taxRate: 18, category: "food", image: "🥩" },
  { id: "5", name: "Chicken Tikka", sku: "FOOD-005", price: 550, taxRate: 18, category: "food", image: "🍖" },
  { id: "6", name: "Fresh Lime Soda", sku: "DRINK-001", price: 80, taxRate: 18, category: "drinks", image: "🍋" },
  { id: "7", name: "Cold Coffee", sku: "DRINK-002", price: 150, taxRate: 18, category: "drinks", image: "☕" },
  { id: "8", name: "Mint Margarita", sku: "DRINK-003", price: 120, taxRate: 18, category: "drinks", image: "🍃" },
  { id: "9", name: "Lassi (Sweet)", sku: "DRINK-004", price: 100, taxRate: 18, category: "drinks", image: "🥛" },
  { id: "10", name: "Soft Drink (500ml)", sku: "DRINK-005", price: 60, taxRate: 18, category: "drinks", image: "🥤" },
  { id: "11", name: "Samosa (2 pcs)", sku: "SNACK-001", price: 50, taxRate: 18, category: "snacks", image: "🥟" },
  { id: "12", name: "Pakora (200g)", sku: "SNACK-002", price: 80, taxRate: 18, category: "snacks", image: "🍤" },
  { id: "13", name: "French Fries (L)", sku: "SNACK-003", price: 250, taxRate: 18, category: "snacks", image: "🍟" },
  { id: "14", name: "Chicken Wings (6 pcs)", sku: "SNACK-004", price: 350, taxRate: 18, category: "snacks", image: "🍗" },
  { id: "15", name: "Fresh Milk (1L)", sku: "DAIRY-001", price: 120, taxRate: 18, category: "dairy", image: "🥛" },
  { id: "16", name: "Yogurt (500g)", sku: "DAIRY-002", price: 80, taxRate: 18, category: "dairy", image: "🥛" },
  { id: "17", name: "Ice Cream (500ml)", sku: "FROZEN-001", price: 250, taxRate: 18, category: "frozen", image: "🍨" },
  { id: "18", name: "Shake (Any flavor)", sku: "FROZEN-002", price: 180, taxRate: 18, category: "frozen", image: "🥤" },
];

const mockCustomers = [
  { id: "1", name: "Walk-in Customer", phone: "" },
  { id: "2", name: "Ahmed Khan", phone: "03001234567" },
  { id: "3", name: "Sara Ali", phone: "03019876543" },
  { id: "4", name: "Bilal Hussain", phone: "03005678901" },
  { id: "5", name: "Fatima Zahra", phone: "03001112223" },
];

const parseNumber = (val) => {
  const n = parseFloat(val);
  return Number.isFinite(n) ? n : 0;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CreateSaleInvoice() {
  const [viewMode, setViewMode] = useState("card");
  
  const [orders, setOrders] = useState([
    { id: 1, name: "Order 1", items: [], customer: mockCustomers[0] }
  ]);
  const [activeOrderId, setActiveOrderId] = useState(1);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const [tableSearch, setTableSearch] = useState("");
  const [stagingItems, setStagingItems] = useState([]);

  const activeOrder = orders.find(o => o.id === activeOrderId) || orders[0];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredStaging = stagingItems.filter(item => 
    item.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
    item.sku.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const addToCart = (product) => {
    const updatedOrders = orders.map(order => {
      if (order.id !== activeOrderId) return order;
      
      const existingItem = order.items.find(item => item.productId === product.id);
      if (existingItem) {
        return {
          ...order,
          items: order.items.map(item => 
            item.productId === product.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      
      return {
        ...order,
        items: [...order.items, {
          id: Date.now(),
          productId: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          taxRate: product.taxRate,
          quantity: 1,
          image: product.image,
        }]
      };
    });
    setOrders(updatedOrders);
  };

  const updateCartItem = (orderId, itemId, field, value) => {
    setOrders(orders.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        items: order.items.map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        )
      };
    }));
  };

  const removeCartItem = (orderId, itemId) => {
    setOrders(orders.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        items: order.items.filter(item => item.id !== itemId)
      };
    }));
  };

  const updateCustomer = (orderId, customerId) => {
    const customer = mockCustomers.find(c => c.id === customerId);
    if (!customer) return;
    
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, customer } : order
    ));
  };

  const createNewOrder = () => {
    const newOrderId = Math.max(...orders.map(o => o.id)) + 1;
    setOrders([...orders, { 
      id: newOrderId, 
      name: `Order ${newOrderId}`, 
      items: [], 
      customer: mockCustomers[0] 
    }]);
    setActiveOrderId(newOrderId);
  };

  const deleteOrder = (orderId) => {
    if (orders.length === 1) return;
    const updatedOrders = orders.filter(o => o.id !== orderId);
    setOrders(updatedOrders);
    if (activeOrderId === orderId) {
      setActiveOrderId(updatedOrders[0].id);
    }
  };

  const calculateOrderTotals = (orderItems) => {
    let subTotal = 0;
    let taxTotal = 0;
    
    orderItems.forEach(item => {
      const qty = parseNumber(item.quantity);
      const price = parseNumber(item.price);
      const taxRate = parseNumber(item.taxRate || 18);
      const lineBase = qty * price;
      const lineTax = (lineBase * taxRate) / 100;
      subTotal += lineBase;
      taxTotal += lineTax;
    });
    
    return { subTotal, taxTotal, grandTotal: subTotal + taxTotal };
  };

  const stagingAddItem = (product) => {
    const existing = stagingItems.find(item => item.productId === product.id);
    if (existing) {
      setStagingItems(stagingItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setStagingItems([...stagingItems, {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        taxRate: product.taxRate,
        quantity: 1,
      }]);
    }
  };

  const updateStagingItem = (itemId, field, value) => {
    setStagingItems(stagingItems.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const removeStagingItem = (itemId) => {
    setStagingItems(stagingItems.filter(item => item.id !== itemId));
  };

  const addStagingToTable = () => {
    setTableSearch("");
  };

  const totals = calculateOrderTotals(activeOrder.items);

  const renderCardView = () => (
    <div className="flex h-full gap-4">
      {/* Left Side - 70% */}
      <div className="flex-[7] flex flex-col gap-4 overflow-hidden">
        {/* Multi Orders Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 shrink-0">
          {orders.map(order => (
            <button
              key={order.id}
              onClick={() => setActiveOrderId(order.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all whitespace-nowrap",
                activeOrderId === order.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:bg-muted"
              )}
            >
              <span className="font-medium text-sm">{order.name}</span>
              <span className="text-xs opacity-70">({order.items.length})</span>
              {orders.length > 1 && (
                <X 
                  className="w-3 h-3 opacity-70 hover:opacity-100" 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteOrder(order.id);
                  }}
                />
              )}
            </button>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={createNewOrder}
            className="shrink-0"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Order
          </Button>
        </div>

        {/* Category Bar */}
        <div className="flex gap-3 overflow-x-auto pb-2 shrink-0">
          {mockCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:bg-muted"
              )}
            >
              <span>{category.icon}</span>
              <span className="font-medium text-sm">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="flex flex-col p-3 rounded-lg border bg-card hover:bg-muted transition-all text-left"
              >
                <div className="text-3xl mb-2">{product.image}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{product.sku}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-sm">{formatCurrency(product.price)}</span>
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - 30% - Cart */}
      <div className="flex-[3] flex flex-col bg-card rounded-lg border overflow-hidden">
        {/* Customer Select */}
        <div className="p-4 border-b">
          <Label className="text-xs text-muted-foreground mb-2 block">Customer</Label>
          <Select
            value={activeOrder.customer.id}
            onValueChange={(val) => updateCustomer(activeOrderId, val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockCustomers.map(customer => (
                <SelectItem key={customer.id} value={customer.id}>
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    {customer.phone && (
                      <div className="text-xs text-muted-foreground">{customer.phone}</div>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeOrder.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
              <p className="text-sm">Cart is empty</p>
              <p className="text-xs">Click products to add</p>
            </div>
          ) : (
            activeOrder.items.map(item => (
              <div key={item.id} className="flex gap-3 p-2 rounded-lg bg-muted/50">
                <div className="text-2xl">{item.image}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">{formatCurrency(item.price)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateCartItem(activeOrderId, item.id, 'quantity', Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateCartItem(activeOrderId, item.id, 'quantity', e.target.value)}
                      className="w-12 h-6 text-center text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateCartItem(activeOrderId, item.id, 'quantity', item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => removeCartItem(activeOrderId, item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                  <span className="font-bold text-sm">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary */}
        <div className="p-4 border-t bg-muted/30 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(totals.subTotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (18%)</span>
            <span>{formatCurrency(totals.taxTotal)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-lg">{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setOrders(orders.map(order => 
                order.id === activeOrderId ? { ...order, items: [] } : order
              ));
            }}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={activeOrder.items.length === 0}
          >
            <Receipt className="w-4 h-4 mr-2" />
            Complete
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTableView = () => (
    <div className="flex flex-col h-full gap-4">
      {/* Search and Add */}
      <div className="flex gap-4 shrink-0">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products to add..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === 'Enter' && addStagingToTable()}
          />
        </div>
        <Button onClick={addStagingToTable}>
          <Plus className="w-4 h-4 mr-2" />
          Add to Staging
        </Button>
      </div>

      {/* Staging Area - when search has results */}
      {tableSearch && filteredProducts.filter(p => 
        p.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(tableSearch.toLowerCase())
      ).length > 0 && (
        <div className="border rounded-lg p-4 bg-muted/30 shrink-0">
          <h4 className="font-medium mb-3">Search Results</h4>
          <div className="flex flex-wrap gap-2">
            {filteredProducts.filter(p => 
              p.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
              p.sku.toLowerCase().includes(tableSearch.toLowerCase())
            ).slice(0, 6).map(product => (
              <Button
                key={product.id}
                variant="outline"
                size="sm"
                onClick={() => stagingAddItem(product)}
              >
                <Plus className="w-3 h-3 mr-1" />
                {product.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Main Table Area - 10 items visible */}
      <div className="flex-1 border rounded-lg overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 bg-muted">
              <tr>
                <th className="text-left p-3 text-xs font-medium">#</th>
                <th className="text-left p-3 text-xs font-medium">Item</th>
                <th className="text-left p-3 text-xs font-medium">SKU</th>
                <th className="text-right p-3 text-xs font-medium w-24">Qty</th>
                <th className="text-right p-3 text-xs font-medium w-28">Price</th>
                <th className="text-right p-3 text-xs font-medium w-24">Tax %</th>
                <th className="text-right p-3 text-xs font-medium w-28">Total</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredStaging.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    No items in table. Search and add products above.
                  </td>
                </tr>
              ) : (
                filteredStaging.map((item, index) => {
                  const lineTotal = (item.price * item.quantity) * (1 + (item.taxRate || 18) / 100);
                  return (
                    <tr key={item.id} className="border-t hover:bg-muted/50">
                      <td className="p-3 text-sm">{index + 1}</td>
                      <td className="p-3 text-sm font-medium">{item.name}</td>
                      <td className="p-3 text-sm text-muted-foreground">{item.sku}</td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateStagingItem(item.id, 'quantity', e.target.value)}
                          className="w-20 text-right"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          value={item.price}
                          onChange={(e) => updateStagingItem(item.id, 'price', e.target.value)}
                          className="w-24 text-right"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={item.taxRate || 18}
                          onChange={(e) => updateStagingItem(item.id, 'taxRate', e.target.value)}
                          className="w-20 text-right"
                        />
                      </td>
                      <td className="p-3 text-sm font-medium text-right">
                        {formatCurrency(lineTotal)}
                      </td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeStagingItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with totals */}
        {filteredStaging.length > 0 && (
          <div className="border-t p-4 bg-muted/30 flex justify-end gap-8 shrink-0">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Items</div>
              <div className="font-medium">{filteredStaging.length}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="font-bold text-lg">
                {formatCurrency(
                  filteredStaging.reduce((sum, item) => 
                    sum + (item.price * item.quantity) * (1 + (item.taxRate || 18) / 100), 0
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end shrink-0">
        <Button variant="outline">
          <X className="w-4 h-4 mr-2" />
          Clear All
        </Button>
        <Button disabled={filteredStaging.length === 0}>
          <Receipt className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b shrink-0">
        <div>
          <h1 className="text-xl font-bold">Sale Invoice</h1>
          <p className="text-sm text-muted-foreground">Create new sale</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
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
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-4">
        {viewMode === "card" ? renderCardView() : renderTableView()}
      </div>
    </div>
  );
}
