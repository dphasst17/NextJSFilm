'use client'
import { fetchBuyTicket } from "@/app/api/apiFilm";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Payment = ({ props }) => {
    const handleApprove = (data, actions) => {
        return actions.order.capture().then((details) => {
            console.log(data.orderID)
            props.setStateForm(prevState => ({...prevState,'orderId':data.orderID}))
            const resultData = {...props.stateForm,'orderId':data.orderID}
            console.log(props.stateForm)
            console.log(resultData)
            fetchBuyTicket(resultData).then(res => {
                if(res.status === 200){
                    alert('Buy ticket is success! Please check your email');
                    props.setIsPaypal(false)
                }
            })
        });
    };
    return (
        <div className="w-[300px] bg-black z-30 my-8" style={{colorScheme: 'none'}}>
            <PayPalScriptProvider className="w-[300px] bg-black rounded-lg" options={{ "client-id": `${process.env.NEXT_PUBLIC_PAY}`}}>
                <PayPalButtons
                    className="!z-40 bg-black rounded-lg"
                    createOrder={async (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                description: 'TICKET INFO',
                                amount: {
                                    value: `${props.price * props.count}`,
                                    breakdown: {
                                        item_total: {
                                            currency_code: 'USD',
                                            value: props.price.toString()
                                        }
                                    }
                                },
                                items: [{
                                    name: `FILM TICKET - ${props.title}`,
                                    quantity: props.count.toString(),
                                    unit_amount: {
                                        currency_code: 'USD',
                                        value: props.price.toString()
                                    }
                                }]
                            }]
                        });
                    }}
                    onApprove={handleApprove}
                />
            </PayPalScriptProvider>
        </div>
    );
}
export default Payment;