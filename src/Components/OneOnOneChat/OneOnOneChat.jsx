import React from 'react'
import './OneOnOneChat.css'
import { useContext } from 'react'
import { ChatContextApi } from '../../Context/ChatProvider'
import ChatLottie from '../../assets/cloud-fun.json'
import LoadingLottie from '../../assets/loading.json'
import TypingLottie from '../../assets/typing-animation.json'
import Lottie from 'lottie-react'
import { Avatar, Box, FormControl, IconButton, Input, Text } from '@chakra-ui/react'
import { BiLeftArrow } from 'react-icons/bi'
import { getSender, getSenderFull } from '../../Config/getSender'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { config } from '../../config'
import ScrollableChats from '../ScrollableChats/ScrollableChats'
import EmojiPicker from 'emoji-picker-react';
import SmileyIcon from '../../assets/smiley.png'
import { IoSendSharp } from 'react-icons/io5'
import io from 'socket.io-client'

const ENDPOINT = 'https://soci-talk.herokuapp.com'
var socket, selectedChatCompare

const OneOnOneChat = () => {

    const context = useContext(ChatContextApi)

    const [pic, setPic] = useState("")
    const [token, setToken] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessages, setNewMessages] = useState('')
    const [showHideEmojiPicker, setShowHideEmojiPicker] = useState(false)
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        if (context.selectedChat) {
            const getPic = getSenderFull(context.user, context.selectedChat.users)
            setPic(getPic.pic);
        }
    }, [context.selectedChat])

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("socitalk-userInfo"))
        setToken(userInfo.token)
    }, [])

    let user = context.user

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", user)
        socket.on("connection", () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
    }, [user])

    const cofigData = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessages) {
            socket.emit("stop typing", context.selectedChat._id)
            let values = { content: newMessages, chatId: context.selectedChat._id }
            try {
                setNewMessages("")
                const { data } = await axios.post(`${config.api}/messages`, values, cofigData)
                socket.emit("new message", data)
                setMessages([...messages, data])
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handlesendMessageUsingArrow = async () => {
        if (newMessages) {
            socket.emit("stop typing", context.selectedChat._id)
            let values = { content: newMessages, chatId: context.selectedChat._id }
            try {
                setNewMessages("")
                const { data } = await axios.post(`${config.api}/messages`, values, cofigData)
                socket.emit("new message", data)
                setMessages([...messages, data])
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleTyping = (e) => {
        setNewMessages(e.target.value)

        if (!socketConnected) return

        if (!typing) {
            setTyping(true)
            socket.emit("typing", context.selectedChat._id)
        }

        let lasttypingTime = new Date().getTime()
        let duration = 2000

        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lasttypingTime

            if (timeDiff >= duration && typing) {
                socket.emit("stop typing", context.selectedChat._id)
                setTyping(false)
            }
        }, duration);
    }

    const getAllMessages = async () => {
        if (context.selectedChat) {
            try {
                setLoading(true)
                const { data } = await axios.get(`${config.api}/messages/${context.selectedChat._id}`, cofigData)
                setMessages(data)
                setLoading(false)
                socket.emit("join chat", context.selectedChat._id)
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        getAllMessages()
        selectedChatCompare = context.selectedChat
    }, [context.selectedChat])

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                // give notifi
            } else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })

    const handleSelectEmoji = (emojiObj) => {
        setNewMessages(prevInput => prevInput + emojiObj.emoji)
    }


    return (
        <>
            {
                context.selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            w="100%"
                            display="flex"
                            justifyContent={{ base: "flex-start" }}
                            gap={2}
                            alignItems="center"
                        >
                            <IconButton
                                fontSize="25px"
                                bg="#ffffffc1"
                                h={"47px"}
                                color={"black"}
                                display={{ base: "flex", md: "none" }}
                                icon={<BiLeftArrow />}
                                onClick={() => context.setSelectedChat("")}
                            />
                            {
                                !context.selectedChat.isGroupChat ? (
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        borderRadius="5px"
                                        w={"100%"}
                                        bg="#ffffffc1"
                                        p={1.5}
                                        color="black"
                                        gap={4}
                                    >
                                        <Avatar w={"35px"} h="35px" src={pic} ml={3} />
                                        <Text fontSize={"20px"}>{getSender(context.user, context.selectedChat.users)}</Text>
                                    </Box>
                                ) : (
                                    <>
                                        {context.selectedChat.chatName.toUpperCase()}
                                    </>
                                )
                            }
                        </Text>
                        <Box
                            display={"flex"}
                            flexDir="column"
                            justifyContent={"flex-end"}
                            p={3}
                            bg="#ffffffc1"
                            w={"100%"}
                            h="78vh"
                            borderRadius={"5px"}
                            overflowY="hidden"
                            mt={2}
                        >
                            {loading ? (
                                <Lottie style={{ width: "300px", alignSelf: "center", margin: "auto" }}
                                    animationData={LoadingLottie} loop={true} />
                            ) : (
                                <div className='messages'>
                                    <ScrollableChats messages={messages} />
                                </div>
                            )}
                            <FormControl onKeyDown={sendMessage} isRequired
                                mt={3}>
                                {isTyping ? <Lottie className='typingAnime' animationData={TypingLottie} loop={true} /> : <></>}
                                <Box>{showHideEmojiPicker ? <EmojiPicker onEmojiClick={handleSelectEmoji} /> : <></>}</Box>
                                <Box display="flex" alignItems={"center"} gap={1}>
                                    <img src={SmileyIcon} className="emojiIcon" onClick={() => setShowHideEmojiPicker(!showHideEmojiPicker)} />
                                    <Input variant={"filled"} bg="teal" placeholder='Enter a message...'
                                        _hover={{ bg: "teal" }} _focus={{ border: "none", bg: "teal" }}
                                        _placeholder={{ color: "white" }}
                                        color="white"
                                        onChange={handleTyping}
                                        value={newMessages} />
                                    <IconButton bg={"teal"} _hover={{ bg: "teal" }} onClick={handlesendMessageUsingArrow}>
                                        <IoSendSharp style={{ fontSize: "25px" }} />
                                    </IconButton>
                                </Box>
                            </FormControl>
                        </Box>
                    </>
                )
                    : (
                        <Box display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDir="column"
                            h="100%"
                        >
                            <Box w="450px"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Lottie className='anime' animationData={ChatLottie} loop={true} />
                            </Box>
                            <Text fontSize="30px">Lets select your friend and make fun...😋</Text>
                        </Box>
                    )
            }
        </>
    )
}

export default OneOnOneChat