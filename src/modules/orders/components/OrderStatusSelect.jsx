import { orderStatus } from '../helpers/orderStatus';

function OrderStatusSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-[1.1rem] border rounded px-2 py-2"
    >
      <option value={orderStatus.ALL}>Todos</option>
      <option value={orderStatus.PENDING}>Pendientes</option>
      <option value={orderStatus.PROCESSING}>Procesadas</option>
      <option value={orderStatus.SHIPPED}>Enviadas</option>
      <option value={orderStatus.DELIVERED}>Entregadas</option>
      <option value={orderStatus.COMPLETED}>Completadas</option>
      <option value={orderStatus.CANCELLED}>Canceladas</option>
    </select>
  );
}
export default OrderStatusSelect;
