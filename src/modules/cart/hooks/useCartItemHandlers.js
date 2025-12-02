export default function useCartItemHandlers({ removeFromCart, updateQuantity, resetDeleteQty, openNotification }) {
  const handleDelete = (item, qtyToDelete) => {
    const remaining = item.quantity - qtyToDelete;

    if (remaining <= 0) {
      removeFromCart(item.sku);
    } else {
      updateQuantity(item.sku, remaining);
    }

    resetDeleteQty(item.sku, 1);
    openNotification(`Se eliminó "${item.name}" del carrito.`);
  };

  return { handleDelete };
}