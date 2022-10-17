import { Avatar, Box, Stack, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { config } from '../../config'
import { ChatContextApi } from '../../Context/ChatProvider'
import { getSender, getSenderPic } from '../../Config/getSender'
import { TiMessages } from 'react-icons/ti'

const ContactBox = () => {

    const context = useContext(ChatContextApi)

    const [loggedUser, setLoggedUser] = useState()
    const [token, setToken] = useState('')

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("socitalk-userInfo"))
        setLoggedUser(userInfo)
        setToken(userInfo.token)
    }, [])

    const cofigData = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const GetChats = async () => {
        try {
            const { data } = await axios.get(`${config.api}/chat`, cofigData)
            context.setChats(data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        GetChats()
    }, [token])

    return (
        <Box className='ContactsBox__container'
            display={{ base: context.selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            m={3}
            bg="teal"
            color="white"
            minHeight="624px"
            w={{ base: "100%", md: "30%" }}
            borderRadius="5px"
        >
            <Box className='contact_header'
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                display="flex"
                w="100%"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                bg="#ffffffc1"
                color="black"
                borderRadius="5px"
            >
                <p>Chats</p>
            </Box>
            <Box display="flex"
                flexDir="column"
                p={3}
                mt={2}
                bg="#ffffffc1"
                w="100%"
                h="545px"
                borderRadius="5px"
                overflowY="hidden"
            >
                <Stack overflowY="auto" p={1}>
                    {
                        context.chats.map((chat) => {
                            return (
                                <Box onClick={() => context.setSelectedChat(chat)}
                                    cursor="pointer"
                                    bg={context.selectedChat === chat ? "teal" : "#adb5bd"}
                                    color={context.selectedChat === chat ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    borderRadius="5px"
                                    key={chat._id}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Box display={"flex"} alignItems="center" gap={5}>
                                        <Avatar outline={"2px solid #f8d247"} size={"sm"} src={!context.chats.isGroupChat ? getSenderPic(loggedUser, chat.users) : (chat.chatName)} />
                                        <Text>
                                            {
                                                !context.chats.isGroupChat ? getSender(loggedUser, chat.users) : (chat.chatName)
                                            }
                                        </Text>
                                    </Box>
                                    <Text>
                                        {
                                            context.selectedChat === chat ? <TiMessages /> : null
                                        }
                                    </Text>
                                </Box>
                            )
                        })
                    }
                </Stack>
            </Box>
        </Box>
    )
}

export default ContactBox