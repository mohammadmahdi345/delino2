import { useEffect, useState, } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";

const Comment = () => {
    const [comment,setComment] = useState('')
    const [message,setMessage] = useState('')
    const { id } = useParams();
    const navigate = useNavigate()

    const handelSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8004/comments/${id}/`,{
                description : comment
            })
            setMessage('با موفقیت ثبت شد')
            navigate('/')
        } catch (error) {
            setMessage('کامنت ثبت نشد')
        }
    }

    return ( 
        <>
        <form className="comment-form" onSubmit={handelSubmit}>
            <textarea
              className="comment-input"
              value={comment}
              onChange={(e)=> setComment(e.target.value)}
              placeholder="نظر خودت رو اینجا بنویس..."
            />

            {/* دکمه با کلاس fancy — ساختارِ HTML لازم برای انیمیشن */}
            <button className="comment-btn fancy" type="submit" aria-label="ثبت کامنت">
              <span>ثبت کامنت</span>
              <span aria-hidden="true">ثبت کامنت</span>

              {/* 5 svg برای sparkles — می‌تونی حذف/کمترشون کنی */}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2 L13.6 8.4 L20 9.2 L14.8 13.6 L16.4 20 L12 16.8 L7.6 20 L9.2 13.6 L4 9.2 L10.4 8.4 Z"/>
              </svg>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2 L13.6 8.4 L20 9.2 L14.8 13.6 L16.4 20 L12 16.8 L7.6 20 L9.2 13.6 L4 9.2 L10.4 8.4 Z"/>
              </svg>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2 L13.6 8.4 L20 9.2 L14.8 13.6 L16.4 20 L12 16.8 L7.6 20 L9.2 13.6 L4 9.2 L10.4 8.4 Z"/>
              </svg>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2 L13.6 8.4 L20 9.2 L14.8 13.6 L16.4 20 L12 16.8 L7.6 20 L9.2 13.6 L4 9.2 L10.4 8.4 Z"/>
              </svg>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2 L13.6 8.4 L20 9.2 L14.8 13.6 L16.4 20 L12 16.8 L7.6 20 L9.2 13.6 L4 9.2 L10.4 8.4 Z"/>
              </svg>
            </button>

            {message && <p className="comment-message">{message}</p>}
        </form>
        </>
     );
}

export default Comment;
