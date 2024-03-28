'use client'
import { fetchBuyTicket } from "@/app/api/apiFilm";
import { StateContext } from "@/app/context/stateContext";
import { getToken } from "@/app/utils";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { use } from "react";

const Payment = ({ props }) => {
    const {setIsLoading,user,setUser} = use(StateContext)
    const GetToken = getToken()
    const handleApprove = (data, actions) => {
        return actions.order.capture().then(async(details) => {
            console.log(data.orderID)
            props.setStateForm(prevState => ({...prevState,'orderId':data.orderID}))
            const resultData = {...props.stateForm,'orderId':data.orderID,seat:props.seat.toUpperCase()}
            const token = await GetToken()
            setIsLoading(true)
            fetchBuyTicket(token,resultData).then(res => {
                setIsLoading(false)
                if(res.status === 200){
                    setUser(user.map(u => {
                        return {
                            ...u,
                            ticket:[
                                {
                                    title:props.title,
                                    idTicket:res.idTicket,
                                    idFilm:props.stateForm.idFilm,
                                    date:props.stateForm.date,
                                    timeFrame:props.stateForm.timeFrame,
                                    background:props.background,
                                    thumbnails:props.thumbnails
                                },
                                ...u.ticket
                            ]
                        }
                    }))
                    console.log(res.idTicket)
                    console.log(user)
                    console.log(props.stateForm)
                    alert('Buy ticket is success! Please check your email');
                    setIsLoading(false)
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