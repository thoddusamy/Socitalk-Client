import React, { useContext } from 'react'
import { ChatContextApi } from '../../Context/ChatProvider'
import './ChatBox.css'
import { Box } from '@chakra-ui/react'
import OneOnOneChat from '../OneOnOneChat/OneOnOneChat'

const ChatBox = () => {

    const context = useContext(ChatContextApi)

    return (
        <Box
            display={{ base: context.selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="teal"
            m={3}
            minHeight="624px"
            w={{ base: "100%", md: "70%" }}
            borderRadius="5px"
        >
            <OneOnOneChat />
        </Box>
    )
}

export default ChatBox