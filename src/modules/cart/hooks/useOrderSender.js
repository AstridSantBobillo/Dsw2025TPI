import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../orders/services/createOrder';
import { handleApiError } from '../../shared/helpers/handleApiError';
import { frontendErrorMessage as orderErrorMessages } from '../../orders/helpers/backendError';


export default function useOrderSender({ user, cart, clearCart, openNotification, openModal }) {
const navigate = useNavigate();


const sendOrder = async () => {
if (!user) {
openModal('loginModal');
return;
}


if (!user?.customerId) {
openNotification('Solo los clientes pueden realizar pedidos.');
return;
}


try {
const orderData = {
customerId: user.customerId,
shippingAddress: 'Sin especificar',
billingAddress: 'Sin especificar',
notes: '',
orderItems: cart.map((item) => ({
productId: item.productId,
quantity: item.quantity,
})),
};


const { error } = await createOrder(orderData);
if (error) throw error;


clearCart();
navigate('/');
} catch (err) {
const result = handleApiError(err, {
frontendMessages: orderErrorMessages,
showAlert: false,
setErrorMessage: openNotification,
});
openNotification(result.message);
}
};


return { sendOrder };
}