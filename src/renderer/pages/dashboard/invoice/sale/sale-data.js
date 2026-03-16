export const mockCategories = [
  { id: "all", name: "All", icon: "📦" },
  { id: "food", name: "Food", icon: "🍔" },
  { id: "drinks", name: "Drinks", icon: "🥤" },
  { id: "snacks", name: "Snacks", icon: "🍿" },
  { id: "dairy", name: "Dairy", icon: "🥛" },
  { id: "frozen", name: "Frozen", icon: "🧊" },
];

export const mockProducts = [
  { id: "1", name: "Chicken Biryani", sku: "FOOD-001", price: 350, taxRate: 18, category: "food", image: "🍚", stock: 45 },
  { id: "2", name: "Beef Pulao", sku: "FOOD-002", price: 400, taxRate: 18, category: "food", image: "🍲", stock: 28 },
  { id: "3", name: "Chicken Karahi", sku: "FOOD-003", price: 1200, taxRate: 18, category: "food", image: "🍗", stock: 12 },
  { id: "4", name: "Seekh Kabab (4 pcs)", sku: "FOOD-004", price: 450, taxRate: 18, category: "food", image: "🥩", stock: 5 },
  { id: "5", name: "Chicken Tikka", sku: "FOOD-005", price: 550, taxRate: 18, category: "food", image: "🍖", stock: 0 },
  { id: "6", name: "Fresh Lime Soda", sku: "DRINK-001", price: 80, taxRate: 18, category: "drinks", image: "🍋", stock: 120 },
  { id: "7", name: "Cold Coffee", sku: "DRINK-002", price: 150, taxRate: 18, category: "drinks", image: "☕", stock: 35 },
  { id: "8", name: "Mint Margarita", sku: "DRINK-003", price: 120, taxRate: 18, category: "drinks", image: "🍃", stock: 8 },
  { id: "9", name: "Lassi (Sweet)", sku: "DRINK-004", price: 100, taxRate: 18, category: "drinks", image: "🥛", stock: 55 },
  { id: "10", name: "Soft Drink (500ml)", sku: "DRINK-005", price: 60, taxRate: 18, category: "drinks", image: "🥤", stock: 200 },
  { id: "11", name: "Samosa (2 pcs)", sku: "SNACK-001", price: 50, taxRate: 18, category: "snacks", image: "🥟", stock: 3 },
  { id: "12", name: "Pakora (200g)", sku: "SNACK-002", price: 80, taxRate: 18, category: "snacks", image: "🍤", stock: 15 },
  { id: "13", name: "French Fries (L)", sku: "SNACK-003", price: 250, taxRate: 18, category: "snacks", image: "🍟", stock: 22 },
  { id: "14", name: "Chicken Wings (6 pcs)", sku: "SNACK-004", price: 350, taxRate: 18, category: "snacks", image: "🍗", stock: 0 },
  { id: "15", name: "Fresh Milk (1L)", sku: "DAIRY-001", price: 120, taxRate: 18, category: "dairy", image: "🥛", stock: 80 },
  { id: "16", name: "Yogurt (500g)", sku: "DAIRY-002", price: 80, taxRate: 18, category: "dairy", image: "🥛", stock: 40 },
  { id: "17", name: "Ice Cream (500ml)", sku: "FROZEN-001", price: 250, taxRate: 18, category: "frozen", image: "🍨", stock: 18 },
  { id: "18", name: "Shake (Any flavor)", sku: "FROZEN-002", price: 180, taxRate: 18, category: "frozen", image: "🥤", stock: 6 },
];

export const mockCustomers = [
  { id: "1", name: "Walk-in Customer", phone: "" },
  { id: "2", name: "Ahmed Khan", phone: "03001234567" },
  { id: "3", name: "Sara Ali", phone: "03019876543" },
  { id: "4", name: "Bilal Hussain", phone: "03005678901" },
  { id: "5", name: "Fatima Zahra", phone: "03001112223" },
];

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const filterProducts = (products, searchQuery, selectedCategory) => {
  return products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
};

export const getStockStatus = (stock) => {
  if (stock === 0) return { label: "Out of Stock", color: "text-red-500", bg: "bg-red-500/10" };
  if (stock <= 5) return { label: `Low Stock (${stock})`, color: "text-amber-500", bg: "bg-amber-500/10" };
  return { label: `In Stock (${stock})`, color: "text-emerald-500", bg: "bg-emerald-500/10" };
};
