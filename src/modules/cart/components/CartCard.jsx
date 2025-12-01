import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button";

export default function CartCard({
  item,            // { sku, name, quantity, currentUnitPrice }
  delQty = 0,      // cantidad "a borrar" que guarda el hook
  onDecrease,      // decrementa delQty (solo si > 1)
  onIncrease,      // incrementa delQty (hasta quantity)
  onDelete,        // aplica el borrado con toDelete calculado
  className = "",
  style,
}) {
  // Valor que mostramos en UI: mínimo 1
  const uiQty = Math.max(1, delQty || 0);

  // Subtotal REAL del carrito (no previsualizamos)
  const subTotal = item.quantity * item.currentUnitPrice;
// dentro de CartCard (referencia rápida)
const disableMinus = delQty <= 1;
const disablePlus = delQty >= item.quantity;

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
          {/* ➖ bajar "a borrar" (mínimo 1) */}
          <Button
            onClick={() => {
              if (!disableMinus) onDecrease();
            }}
            disabled={disableMinus}
            className="px-2 py-1 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Borrar una unidad menos"
            title="Borrar una unidad menos"
          >
            ➖
          </Button>

          {/* Mostrar SIEMPRE al menos 1 */}
          <span className="w-6 text-center text-sm font-semibold">
            {uiQty}
          </span>

          {/* ➕ subir "a borrar" (máximo stock en carrito) */}
          <Button
            onClick={() => {
              if (!disablePlus) onIncrease();
            }}
            disabled={disablePlus}
            className="px-2 py-1 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Borrar una unidad más"
            title="Borrar una unidad más"
          >
            ➕
          </Button>

          <Button
            className="ml-2 text-xs px-3 py-1 font-semibold"
            onClick={() => onDelete(uiQty)} // ← pasamos la UI (>=1)
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
