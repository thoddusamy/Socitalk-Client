import React, { useEffect } from 'react'
import './ChatPage.css'
import { useNavigate } from 'react-router-dom'
import ContactsBox from '../../Components/ContactsBox/ContactsBox'
import ChatBox from '../../Components/ChatBox/ChatBox'
import Navbar from '../../Components/Navbar/Navbar'

const ChatPage = () => {

    const navigate = useNavigate()

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem("socitalk-userInfo"))
        if (!userDetails) {
            navigate('/')
        }
    }, [])


    return (
        <div className='chat_container'>
            <div className="navbar">
                <Navbar />
            </div>
            <div className="contactAndChat__container">
                <ContactsBox />
                <ChatBox />
            </div>
        </div>
    )
}

export default ChatPage