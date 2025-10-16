import React, { useEffect, useState } from "react";
import axios from "axios";
import { Component } from "react";
import { Route, Routes } from "react-router-dom";
import { Link, useParams } from "react-router-dom";

class User extends Component {
    state = { user:{full_name:'',email:''} , message:'' } 



    handelChange = (e) => {
        const input = e.target;
        const user = {...this.state.user}
        user[input.name] = input.value
        this.setState({user:user})
    }

    handelCLick = async(e) => {
        e.preventDefault();

        try {
            const response = await axios.put('http://localhost:8004/user/',this.state.user)
            this.setState({user:response.data})
            this.setState({message:'موفقیت آمیز'})
        } catch (error) {
            this.setState({ message: error.response?.data?.detail || 'خطایی رخ داد ❌' });
        }
        
    }



    render() { 
        return (
        <>
        <h1>اطلاعات خود را بروز کنید</h1>
        <form>
            <input name="full_name" value={this.state.user.full_name} placeholder="نام و نام خانوداگی" onChange={this.handelChange} />
            <input name="email" value={this.state.user.email} placeholder="ایمیل" onChange={this.handelChange} />
            <button onClick={this.handelCLick}>ثبت</button>
        </form>
        </>
        );
    }
}
 
export default User;