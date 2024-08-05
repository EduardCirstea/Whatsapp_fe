import React, { useState, useRef } from "react";
import EmojiPickerApp from "./EmojiPickerApp";
import { Attachment } from "./attachment";
import Input from "./Input";
import { SendIcon } from "../../../svg";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../../features/chatSlice";
import SocketContext from "../../../context/SocketContext.js";
import { ClipLoader } from "react-spinners";

function ChatActions({ socket }) {
  const dispatch = useDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { activeConversation, status } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const values = {
    message,
    convo_id: activeConversation._id,
    files: [],
    token,
  };
  const textRef = useRef();
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    setLoading(true);
    let newMessage = await dispatch(sendMessage(values));
    socket.emit("send message", newMessage.payload);
    setMessage("");
    setLoading(false);
  };
  return (
    <form
      onSubmit={(e) => sendMessageHandler(e)}
      className="dark:bg-dark_bg_2 h-[60px] w-full flex items-center absolute bottom-0 py-2 px-4 select-none"
    >
      <div className="w-full flex items-center gap-x-2">
        <ul className="flex gap-x-2">
          <EmojiPickerApp
            textRef={textRef}
            message={message}
            setMessage={setMessage}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            setShowAttachments={setShowAttachments}
          />
          <Attachment
            showAttachments={showAttachments}
            setShowAttachments={setShowAttachments}
            setShowPicker={setShowPicker}
          />
        </ul>
        <Input message={message} setMessage={setMessage} textRef={textRef} />
        <button type="submit" className="btn">
          {status === "loading" && loading ? (
            <ClipLoader color="#E9EDEF" size={25} />
          ) : (
            <SendIcon className="dark:fill-dark_svg_1" />
          )}
        </button>
      </div>
    </form>
  );
}

const ChatActionsWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatActions {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ChatActionsWithSocket;
