import { useState } from "react";
import {
  Plus,
  Trash2,
  User,
  CalendarDays,
  Hash,
  Percent,
  ShoppingCart,
  CreditCard,
  Receipt,
} from "lucide-react";
import { Button } from "@/renderer/components/ui/button";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/renderer/components/ui/card";
import { Separator } from "@/renderer/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";

const emptyLineItem = () => ({
  id: Date.now() + Math.random(),
  name: "",
  sku: "",
  quantity: 1,
  price: "",
  discount: 0,
  taxRate: 0,
});

const CreateSaleInvoice = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [invoiceMeta, setInvoiceMeta] = useState({
    number: "INV-0001",
    date: new Date().toISOString().slice(0, 10),
    paymentStatus: "unpaid",
  });
  const [lineItems, setLineItems] = useState([emptyLineItem()]);
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [amountPaid, setAmountPaid] = useState("");

  const handleCustomerChange = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleMetaChange = (field, value) => {
    setInvoiceMeta((prev) => ({ ...prev, [field]: value }));
  };

  const handleLineChange = (id, field, value) => {
    setLineItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addLineItem = () => {
    setLineItems((items) => [...items, emptyLineItem()]);
  };

  const removeLineItem = (id) => {
    setLineItems((items) => (items.length > 1 ? items.filter((i) => i.id !== id) : items));
  };

  const parseNumber = (val) => {
    const n = parseFloat(val);
    return Number.isFinite(n) ? n : 0;
  };

  const totals = (() => {
    let subTotal = 0;
    let taxTotal = 0;

    lineItems.forEach((item) => {
      const qty = parseNumber(item.quantity);
      const price = parseNumber(item.price);
      const discount = parseNumber(item.discount);
      const taxRate = parseNumber(item.taxRate);

      const lineBase = qty * price;
      const lineDiscount = (lineBase * discount) / 100;
      const lineAfterDiscount = lineBase - lineDiscount;
      const lineTax = (lineAfterDiscount * taxRate) / 100;

      subTotal += lineAfterDiscount;
      taxTotal += lineTax;
    });

    const invoiceLevelDiscount = (subTotal * parseNumber(invoiceDiscount)) / 100;
    const grandTotal = subTotal - invoiceLevelDiscount + taxTotal;
    const paid = parseNumber(amountPaid);
    const due = Math.max(grandTotal - paid, 0);
    const change = Math.max(paid - grandTotal, 0);

    return {
      subTotal,
      taxTotal,
      invoiceLevelDiscount,
      grandTotal,
      paid,
      due,
      change,
    };
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log("Sale invoice created:", {
        customer,
        invoiceMeta,
        lineItems,
        invoiceDiscount,
        amountPaid,
        totals,
      });
      alert("Sale invoice created (mock)!");
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Create Sale Invoice
              </h1>
              <p className="text-muted-foreground mt-1">
                Record a new sale for your customer
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Receipt className="mr-2 h-4 w-4" />
                    Create Invoice
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - Customer & Line Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Details
                  </CardTitle>
                  <CardDescription>
                    Who are you selling this invoice to?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="customerName">Customer name</Label>
                      <Input
                        id="customerName"
                        placeholder="Walk-in customer"
                        value={customer.name}
                        onChange={(e) =>
                          handleCustomerChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Phone</Label>
                      <Input
                        id="customerPhone"
                        placeholder="Optional"
                        value={customer.phone}
                        onChange={(e) =>
                          handleCustomerChange("phone", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor="customerEmail">Email (optional)</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        placeholder="For sending invoice receipt"
                        value={customer.email}
                        onChange={(e) =>
                          handleCustomerChange("email", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Line Items
                  </CardTitle>
                  <CardDescription>
                    Add products or services to this sale
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="hidden md:grid grid-cols-12 gap-3 text-xs text-muted-foreground">
                    <span className="col-span-4">Item</span>
                    <span className="col-span-2 text-right">Quantity</span>
                    <span className="col-span-2 text-right">Price</span>
                    <span className="col-span-1 text-right">Disc %</span>
                    <span className="col-span-1 text-right">Tax %</span>
                    <span className="col-span-2 text-right">Total</span>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    {lineItems.map((item) => {
                      const qty = parseNumber(item.quantity);
                      const price = parseNumber(item.price);
                      const discount = parseNumber(item.discount);
                      const taxRate = parseNumber(item.taxRate);

                      const base = qty * price;
                      const discAmount = (base * discount) / 100;
                      const afterDisc = base - discAmount;
                      const taxAmount = (afterDisc * taxRate) / 100;
                      const lineTotal = afterDisc + taxAmount;

                      return (
                        <div
                          key={item.id}
                          className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start"
                        >
                          <div className="md:col-span-4 space-y-2">
                            <Label className="md:hidden text-xs">
                              Item name
                            </Label>
                            <Input
                              placeholder="Search or enter item name"
                              value={item.name}
                              onChange={(e) =>
                                handleLineChange(item.id, "name", e.target.value)
                              }
                            />
                            <Input
                              placeholder="SKU / barcode (optional)"
                              value={item.sku}
                              onChange={(e) =>
                                handleLineChange(item.id, "sku", e.target.value)
                              }
                              className="text-xs"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1">
                            <Label className="md:hidden text-xs">
                              Quantity
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleLineChange(
                                  item.id,
                                  "quantity",
                                  e.target.value,
                                )
                              }
                              className="text-right"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1">
                            <Label className="md:hidden text-xs">Price</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price}
                              onChange={(e) =>
                                handleLineChange(item.id, "price", e.target.value)
                              }
                              className="text-right"
                            />
                          </div>
                          <div className="md:col-span-1 space-y-1">
                            <Label className="md:hidden text-xs">
                              Discount %
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={item.discount}
                              onChange={(e) =>
                                handleLineChange(
                                  item.id,
                                  "discount",
                                  e.target.value,
                                )
                              }
                              className="text-right"
                            />
                          </div>
                          <div className="md:col-span-1 space-y-1">
                            <Label className="md:hidden text-xs">
                              Tax %
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={item.taxRate}
                              onChange={(e) =>
                                handleLineChange(
                                  item.id,
                                  "taxRate",
                                  e.target.value,
                                )
                              }
                              className="text-right"
                            />
                          </div>
                          <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-2">
                            <div className="flex flex-col items-start md:items-end">
                              <span className="text-xs text-muted-foreground">
                                Line total
                              </span>
                              <span className="font-medium tabular-nums">
                                ${lineTotal.toFixed(2)}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => removeLineItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={addLineItem}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add line item
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right - Invoice meta & summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                  <CardDescription>
                    Basic information about this invoice
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber" className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      Invoice number
                    </Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceMeta.number}
                      onChange={(e) =>
                        handleMetaChange("number", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoiceDate" className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      Invoice date
                    </Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={invoiceMeta.date}
                      onChange={(e) =>
                        handleMetaChange("date", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Payment status</Label>
                    <Select
                      value={invoiceMeta.paymentStatus}
                      onValueChange={(value) =>
                        handleMetaChange("paymentStatus", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="partial">Partially paid</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium tabular-nums">
                        ${totals.subTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tax total</span>
                      <span className="font-medium tabular-nums">
                        ${totals.taxTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Percent className="h-3 w-3" />
                        Invoice discount
                      </span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={invoiceDiscount}
                          onChange={(e) =>
                            setInvoiceDiscount(e.target.value)
                          }
                          className="w-20 h-8 text-right text-xs"
                        />
                        <span className="text-xs text-muted-foreground">
                          -${totals.invoiceLevelDiscount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">Grand total</span>
                    <span className="font-semibold text-lg tabular-nums">
                      ${totals.grandTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label className="flex items-center gap-1" htmlFor="amountPaid">
                      <CreditCard className="h-3 w-3" />
                      Amount paid
                    </Label>
                    <Input
                      id="amountPaid"
                      type="number"
                      min="0"
                      step="0.01"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Amount due</span>
                      <span className="font-medium tabular-nums">
                        ${totals.due.toFixed(2)}
                      </span>
                    </div>
                    {totals.change > 0 && (
                      <div className="flex items-center justify-between text-emerald-600">
                        <span>Change to return</span>
                        <span className="font-semibold tabular-nums">
                          ${totals.change.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Quick Tips
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Use customer details to send receipts by email.</li>
                    <li>• Apply invoice discount for order-level promotions.</li>
                    <li>• Record partial payments and keep track of amount due.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSaleInvoice;
