import useLocalStorage from "../../shared/hooks/useLocalStorage";

const CART_KEY = "cart";

export function useCart() {
  const [cart, setCart] = useLocalStorage(CART_KEY, []);

  const addToCart = (product, quantity) => {
    if (quantity < 1) return;
    setCart(prev => {
      const idx = prev.findIndex(i => i.sku === product.sku);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, {
        ...product,
        productId: product.id ?? product.sku,
        quantity
      }];
    });
  };

  const removeFromCart = sku =>
    setCart(prev => prev.filter(i => i.sku !== sku));

  const clearCart = () => setCart([]);

  const updateQuantity = (sku, newQuantity) => {
    setCart(prev => {
      if (newQuantity <= 0) return prev.filter(i => i.sku !== sku);
      return prev.map(i => i.sku === sku ? { ...i, quantity: newQuantity } : i);
    });
  };

  return { cart, addToCart, removeFromCart, clearCart, updateQuantity };
}
