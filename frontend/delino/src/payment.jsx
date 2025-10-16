import { useEffect, useState, } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";


const Payment = () => {
    const {id} = useParams()
    const [payment,setPayment] = useState(null)
    const [gateway,setGateway] = useState(null)
    const [message,setMessage] = useState('')

    useEffect(()=>{
        const gateway = async() => {
            try {
                const response =  await axios.get('http://localhost:8004/gateway/')
                setGateway(response.data[0])
            } catch (err) {
                setMessage(err.response?.data?.detail || "خطا در درگاه پرداخت");
            }
        };
        gateway();
    },[])
    useEffect(()=>{
        const payment = async() => {
            try {
                const response =  await axios.post(`http://localhost:8004/payment/${id}/`)
                setPayment(response.data)
                setMessage('به درستی پرداخت شد')
            } catch (err) {
                setMessage(err.response?.data?.detail || "پرداخت با شکست مواجه شد");
            }
        };
        payment();
    },[id])


    return ( 
        <>
        {gateway && (
            <div>
                <h1>{gateway.name}</h1>
                <h1>{gateway.description}</h1>
            </div>
        )}
        {payment && (
            <div>
                <h1>{payment.detail}</h1>
                <h2>{payment.user.full_name}</h2>
                <h2>{payment.paid_at}</h2>
                <h2>{payment.ref_id}</h2>
            </div>
        )}
        <p>{message}</p>
        
        </>
     );
}
 
export default Payment;