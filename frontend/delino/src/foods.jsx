import { useEffect, useState, } from "react";
import axios from 'axios';


const Food = () => {
    const [food, setFood] = useState([])
    const [message, setMessage] = useState('در حال بارگذاری...')


    useEffect(() => {
    const fetchFoods = async () => {
    try {
    const response = await axios.get('http://localhost:8004/foods/')
    setFood(response.data)
    setMessage('غذاها به خوبی بارگذاری شدند')
    } catch (error) {
    console.error(error)
    setMessage(error?.message || 'خطا در دریافت اطلاعات')
    }
    }
    fetchFoods()
    }, [])


    return (
    <section className="food-section" aria-label="فهرست غذاها">
    <p className="food-message">{message}</p>


    <div className="food-carousel" role="list">
    {food.length > 0 ? (
    food.map((f) => (
    <article className="food-card" key={f.pk} role="listitem">
    <div className="card-inner">
    <img className="card-avatar" src={f.avatar} alt={f.name} loading="lazy" />
    <div className="card-body">
    <h3 className="card-title">{f.name}</h3>
    <p className="card-desc">{f.description}</p>
    </div>
    </div>
    </article>
    ))
    ) : (
    <div className="empty-placeholder">هیچ غذایی یافت نشد</div>
    )}
    </div>
    </section>
    )
    }


export default Food