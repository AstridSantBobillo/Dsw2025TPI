// Components
import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button";

function normalizeStatus(raw) {
  if (!raw) return "";
  const s = String(raw).toUpperCase().trim();
  return  s;
}

function StatusPill({ status }) {
  const key = normalizeStatus(status);

  const map = {
    PENDING:    "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED:    "bg-indigo-100 text-indigo-700",
    DELIVERED:  "bg-green-100 text-green-700",
    COMPLETED:  "bg-emerald-100 text-emerald-700",
    CANCELED:  "bg-red-100 text-red-700",
    "":         "bg-gray-200 text-gray-700",
    default:    "bg-gray-200 text-gray-700",
  };

  const cls = map[key] || map.default;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
      {key || "—"}
    </span>
  );
}


/**
 * Props:
 * - order: { id, customerId, status, totalAmount?, createdAt? }
 * - onView?: () => void
 * - trailing?: ReactNode
 * - showTotal?: boolean (default false)
 * - showCreatedAt?: boolean (default false)
 */
export default function OrderCard({
  order,
  onView,
  trailing,
  showTotal = false,
  showCreatedAt = false,
}) {
  const { id, customerId, status, totalAmount, createdAt } = order || {};

  return (
    <Card className="animate-slideUp">
      <div className="flex justify-between items-center w-full gap-3">
        <div className="min-w-0">
          <h1>#{id} | {customerId}</h1>

          {/* Meta: Estado con etiqueta y pill, opcionales total/fecha */}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-700">
            <span className="text-gray-600">Estado:</span>
            <StatusPill status={status} />

            {showTotal && typeof totalAmount === "number" && (
              <span className="text-gray-700">Total: ${totalAmount.toFixed(2)}</span>
            )}

            {showCreatedAt && createdAt && (
              <span className="text-gray-500">
                {new Date(createdAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onView && (
            <Button className="hidden sm:flex h-10 px-3" onClick={onView}>
              Ver
            </Button>
          )}
          {trailing}
        </div>
      </div>
    </Card>
  );
}
