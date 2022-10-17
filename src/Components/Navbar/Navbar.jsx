import React, { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { config } from '../../config'
import { useContext } from 'react'
import { ChatContextApi } from '../../Context/ChatProvider'

const Navbar = () => {

    const navigate = useNavigate()

    const context = useContext(ChatContextApi)

    const [profile, setProfile] = useState('')
    const [name, setName] = useState('')
    const [token, setToken] = useState('')
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])

    const [showProfilePopup, setShowProfilePopup] = useState(false)

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("socitalk-userInfo"))
        setProfile(userInfo.pic)
        setName(userInfo.name)
        setToken(userInfo.token)
        context.setUser(userInfo)
    }, [])

    const refOne = useRef(null)

    useEffect(() => {
        document.addEventListener("click", handleDetectOutsideClick1, true)
    }, [])

    const handleDetectOutsideClick1 = (e) => {
        if (!refOne.current.contains(e.target)) {
            setShowProfilePopup(false)
        }
    }

    const handleShowHideProfilePopup = () => {
        showProfilePopup === false ? setShowProfilePopup(true) : setShowProfilePopup(false)
    }

    const handleLogout = () => {
        localStorage.removeItem("socitalk-userInfo")
        navigate('/')
    }

    const cofigData = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const handleSearch = async (value) => {
        setSearch(value)
        try {
            const { data } = await axios.get(`${config.api}/user/allusers?search=${value}`, cofigData)
            setSearchResult(data)
        } catch (error) {
            console.log(error);
        }
    }

    const accessChat = async (userId) => {
        try {
            let values = { userId: userId }
            const { data } = await axios.post(`${config.api}/chat`, values, cofigData)
            if (!context.chats.find((c) => c._id === data._id)) context.setChats([data, ...context.chats])
            context.setSelectedChat(data)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='Navbar__container'>
            <div className="brand_name">
                <p>SOCITALK</p>
            </div>
            <div className="searchBar_container">
                <input type="search" name="" id="" placeholder='Find your friends here...'
                    onChange={(e) => handleSearch(e.target.value.trim())} />
            </div>
            <div className="searchResult_popup" style={search ? { display: "block" } : { display: "none" }}>
                {
                    searchResult?.map((res) => {
                        return (
                            <div className="userOne" key={res._id} onClick={() => accessChat(res._id)}>
                                <img src={res.pic} alt="profile" />
                                <div>
                                    <p>{res.name}</p>
                                    <p>{res.email}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="profile_section">
                <p>{name}</p>
                <img src={profile} alt="profile-pic" ref={refOne} onClick={handleShowHideProfilePopup} />
            </div>
            <div className={showProfilePopup ? "profile_popup show" : "profile_popup hide"}>
                <div className="popup">
                    <p>SOCITALK</p>
                    <p>Hello, {name}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    )
}

export default Navbar