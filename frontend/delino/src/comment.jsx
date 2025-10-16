import { useEffect, useState, } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";

const Comment = () => {
    const [comment,setComment] = useState('')
    const [message,setMessage] = useState('')
    const { id } = useParams();

    const handelSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8004/comments/${id}/`,{
                description : comment
            })
            setMessage('با موفقیت ثبت شد')
        } catch (error) {
            setMessage('کامنت ثبت نشد')
        }
    }

    return ( 
        <>
        <form onSubmit={handelSubmit}>
            <input value={comment} onChange={(e)=> setComment(e.target.value)} />
            <button>ثبت کامنت</button>         
        </form>
        </>
     );
}
 
export default Comment;