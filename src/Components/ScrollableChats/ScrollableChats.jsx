import { Avatar } from '@chakra-ui/react'
import React, { useContext, useEffect, useRef } from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../Config/getSender'
import { ChatContextApi } from '../../Context/ChatProvider'

const ScrollableChats = ({ messages }) => {

    const context = useContext(ChatContextApi)

    const messageEndRef = useRef(null)

    useEffect(() => {
        messageEndRef.current?.scrollIntoView()
    }, [messages])


    return (
        <div>
            {messages && messages.map((msg, i) => (
                <div style={{ display: "flex", alignItems: "center" }} key={msg._id}>
                    {
                        (isSameSender(messages, msg, i, context.user._id) || isLastMessage(messages, i, context.user._id))
                        && (
                            <Avatar
                                mt={"7px"}
                                mr={1}
                                size={"sm"}
                                cursor="pointer"
                                bg={"teal"}
                                name={msg.sender.name}
                                src={msg.sender.pic}
                            />
                        )
                    }
                    <span style={{
                        backgroundColor: `${msg.sender._id === context.user._id ? "teal" : "#adb5bd"}`,
                        color: `${msg.sender._id === context.user._id ? "white" : "black"}`,
                        borderTopRightRadius: "20px",
                        borderTopLeftRadius: "20px",
                        borderBottomRightRadius: `${msg.sender._id === context.user._id ? "0px" : "20px"}`,
                        borderBottomLeftRadius: `${msg.sender._id === context.user._id ? "20px" : "0px"}`,
                        padding: "5px 15px", maxWidth: "75%",
                        marginLeft: isSameSenderMargin(messages, msg, i, context.user._id),
                        marginTop: isSameUser(messages, msg, i, context.user._id) ? 3 : 10,
                    }}
                    >
                        {msg.content}
                    </span>
                </div>
            ))}
            <div ref={messageEndRef} />
        </div>
    )
}

export default ScrollableChats