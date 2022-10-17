import { createContext, useContext, useEffect, useState } from 'react'

export const ChatContextApi = createContext()

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])

    useEffect(() => {
        let userInfo = JSON.parse(localStorage.getItem("socitalk-userInfo"))
        setUser(userInfo)
    }, [])

    return (
        <ChatContextApi.Provider
            value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
        >
            {children}
        </ChatContextApi.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContextApi)
}

export default ChatProvider
