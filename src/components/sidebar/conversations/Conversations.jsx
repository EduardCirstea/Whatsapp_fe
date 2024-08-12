import { useSelector } from "react-redux";
import Conversation from "./Conversation";
import { getConversationId, checkOnlineStatus } from "../../../utils/chat";
export default function Conversations({ onlineUsers, typing }) {
  const { conversations, activeConversation } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.user);

  return (
    <div className="convos scrollbar">
      <ul>
        {conversations &&
          conversations
            .filter((c) => c.latestMessage || c._id === activeConversation._id)
            .map((conv, i) => {
              let check = checkOnlineStatus(onlineUsers, user, conv.users);
              return (
                <Conversation
                  conv={conv}
                  key={conv._id}
                  online={check ? true : false}
                  typing={typing}
                />
              );
            })}
      </ul>
    </div>
  );
}
