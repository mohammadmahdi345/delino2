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
        <div className="payment-shell" dir="rtl">
            <div className="payment-stage">
            <header className="payment-hero">
                <div className="gateway-badge">
                <span className="gateway-name">{gateway?.name}</span>
                </div>
                <div className="gateway-desc">{gateway?.description}</div>
            </header>

            <main className="payment-body">
                {payment ? (
                <section className="receipt-card" aria-live="polite">
                    <div className="receipt-holo" aria-hidden="true"></div>

                    <div className="receipt-top">
                    <h3 className="receipt-title">رسید پرداخت</h3>
                    <div className="receipt-meta">
                        <span className="meta-item"><strong>شناسه مرجع:</strong> <span className="neon-ref">{payment.ref_id}</span></span>
                        <span className="meta-item"><strong>تاریخ:</strong> {payment.paid_at}</span>
                    </div>
                    </div>

                    <div className="receipt-body">
  <div className="user-row">
    <div className="user-avatar" aria-hidden="true">
      {/* حروف اول نام کاربر */}
      {payment.user?.full_name ? payment.user.full_name.split(' ').map(n=>n[0]).slice(0,2).join('') : 'U'}
    </div>
    <div className="user-col">
      <div className="user-name">{payment.user?.full_name || 'کاربر ناشناس'}</div>
      <div className="user-email">{payment.user?.email || ''}</div>
    </div>
    <div className="paid-date">
      <div className="date-label">تاریخ پرداخت</div>
      <div className="date-value">{payment.paid_at ? new Date(payment.paid_at).toLocaleString('fa-IR') : '-'}</div>
    </div>
  </div>

  <div className="detail-row">
    <div className="detail-label">جزئیات</div>
    <div className="detail-value">{payment.detail || '-'}</div>
  </div>

  <div className="amount-row">
    <div className="amount-label">مبلغ</div>
    <div className="amount-value">
      <span className="amount-badge">{payment.amount ?? payment.total_price ?? '-'}</span>
      <span className="currency">تومان</span>
    </div>
  </div>

  <div className="receipt-actions">
    <button className="action-btn" onClick={() => window.print()}>چاپ رسید</button>
    <button className="action-btn ghost" onClick={() => (window.location.href = '/')}>بازگشت به خانه</button>
  </div>
</div>

                </section>
                ) : (
                <div className="payment-wait">
                    <div className="spinner" aria-hidden="true"></div>
                    <p className="wait-text">{message || "در حال پردازش پرداخت..."}</p>
                </div>
                )}
            </main>

            <footer className="payment-foot">
                <p className="foot-note">پرداخت از طریق درگاه امن — تراکنش رمزنگاری‌شده</p>
            </footer>
            </div>
        </div>
        );
}
 
export default Payment;