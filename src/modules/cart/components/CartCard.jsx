import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button";

/**
 * Props:
 * - item: { sku, name, quantity, currentUnitPrice }
 * - delQty: number  (cantidad "a borrar" => default 1)
 * - onDecrease(): void
 * - onIncrease(): void
 * - onDelete(toDelete: number): void   ⬅️ recibe la cantidad a borrar
 */
export default function CartCard({
  item,
  delQty = 1,         // ⬅️ arranca en 1
  onDecrease,
  onIncrease,
  onDelete,
  className = "",
  style,
}) {
  const uiQty = Math.max(1, Number.isFinite(delQty) ? delQty : 1);

  // Totales reales (no previsualizamos borrado)
  const subTotal = item.quantity * item.currentUnitPrice;

  const disableMinus = uiQty <= 1;
  const disablePlus  = uiQty >= item.quantity;

  return (
    <Card className={`p-4 animate-slideUp ${className}`} style={style}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          <h2 className="text-base font-semibold">{item.name}</h2>

          <p className="text-gray-600 text-xs mt-1">
            Cantidad en carrito: <strong>{item.quantity}</strong>
          </p>

          <p className="text-gray-600 text-xs mt-1">
            Sub Total: <strong>${subTotal.toFixed(2)}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => !disableMinus && onDecrease()}
            disabled={disableMinus}
            className="px-2 py-1 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Borrar una unidad menos"
            title="Borrar una unidad menos"
          >
            ➖
          </Button>

          <span className="w-6 text-center text-sm font-semibold">{uiQty}</span>

          <Button
            onClick={() => !disablePlus && onIncrease()}
            disabled={disablePlus}
            className="px-2 py-1 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Borrar una unidad más"
            title="Borrar una unidad más"
          >
            ➕
          </Button>

          <Button
            className="ml-2 text-xs px-3 py-1 font-semibold"
            onClick={() => onDelete(uiQty)}   // ⬅️ pasamos la cantidad a borrar
          >
            Borrar
          </Button>
        </div>
      </div>

      {uiQty >= item.quantity && (
        <p className="text-red-600 text-xs font-medium mt-2">
          Si borra, este producto se eliminará del carrito.
        </p>
      )}
    </Card>
  );
}
