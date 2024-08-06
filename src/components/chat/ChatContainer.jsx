import { useEffect } from "react";
import { ChatHeader } from "./header";
import { ChatMessages } from "./messages";
import { useDispatch, useSelector } from "react-redux";
import { getConversationMessages } from "../../features/chatSlice";
import { ChatActions } from "./actions";
import { checkOnlineStatus, getConversationId } from "../../utils/chat";

export default function ChatContainer({ onlineUsers }) {
  const dispatch = useDispatch();
  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const values = {
    token,
    convo_id: activeConversation?._id,
  };
  useEffect(() => {
    if (activeConversation?._id) {
      dispatch(getConversationMessages(values));
    }
  }, [activeConversation]);

  return (
    <div className="relative w-full h-full border-l dark:border-l-dark_border_2 select-none overflow-hidden ">
      <ChatHeader
        online={checkOnlineStatus(onlineUsers, user, activeConversation.users)}
      />
      <ChatMessages />
      <ChatActions />
    </div>
  );
}
