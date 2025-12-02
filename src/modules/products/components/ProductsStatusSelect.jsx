import productStatus from '../helpers/productsStatus';

function ProductStatusSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='text-[1.1rem] border rounded px-2 py-2'
    >
      <option value={productStatus.ALL}>Todos</option>
      <option value={productStatus.ENABLED}>Habilitados</option>
      <option value={productStatus.DISABLED}>Inhabilitados</option>
    </select>
  );
}

export default ProductStatusSelect;
