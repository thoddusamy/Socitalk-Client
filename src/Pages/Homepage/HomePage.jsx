import React, { useState, useEffect } from 'react'
import './HomePage.css'
import Lottie from 'lottie-react'
import AnimeLottie from '../../assets/robot-says-hello.json'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import Login from '../../Components/Login/Login'
import Register from '../../Components/Register/Register'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {

    const navigate = useNavigate()

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem("socitalk-userInfo"))
        if (userDetails) {
            navigate('/chats')
        }
    }, [navigate])

    const [bgColor, setBgColor] = useState(false)

    return (
        <div className='login__container'>
            <div className="grid__Container">
                <div className="left">
                    <Lottie className='anime' animationData={AnimeLottie} loop={true} />
                    <div>
                        <p>Welcome to</p>
                        <p>SOCITALK</p>
                    </div>
                </div>
                <div className="right">
                    <div className="brand_name">
                        <p>SOCITALK</p>
                    </div>
                    <div className="btns_div">
                        <Tabs variant='soft-rounded'>
                            <TabList>
                                <Tab onClick={() => setBgColor(false)}
                                    style={bgColor ? null : { backgroundColor: "teal", color: "#fff" }}>Login</Tab>
                                <Tab onClick={() => setBgColor(true)}
                                    style={bgColor ? { backgroundColor: "teal", color: "#fff" } : null}>Register</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Login />
                                </TabPanel>
                                <TabPanel>
                                    <Register />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage