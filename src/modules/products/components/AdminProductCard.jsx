// Components
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function StatusPill({ active }) {
  return (
    <span
      className={[
        'px-2 py-1 rounded-full text-xs font-medium',
        active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700',
      ].join(' ')}
    >
      {active ? 'ACTIVADO' : 'DESACTIVADO'}
    </span>
  );
}

/**
 * Props:
 * - product: { sku, name, stockQuantity, currentUnitPrice, isActive }
 * - onView?: () => void
 * - onEdit?: () => void
 * - trailing?: ReactNode (botones/custom extra)
 * - titleClassName?: string // opcional: estilos SOLO para el título
 */
export default function AdminProductCard({
  product,
  onView,
  onEdit,
  trailing,
}) {
  const { sku, name, stockQuantity, isActive } = product || {};

  return (
    <Card className="animate-slideUp">
      <div className="flex justify-between items-center w-full gap-3">
        <div className="min-w-0">
          <h1>
            {sku} - {name}
          </h1>

          <div className="text-sm text-gray-700 mt-1">
            Stock: {stockQuantity} - Estado: <StatusPill active={!!isActive} />
          </div>

        </div>

        <div className="flex items-center gap-2">
          {onEdit && (
            <Button className="hidden sm:flex h-10 px-3" onClick={onEdit}>
              Editar
            </Button>
          )}
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
