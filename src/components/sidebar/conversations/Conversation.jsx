import { open_create_conversation } from "../../../features/chatSlice";
import { dateHandler } from "../../../utils/date";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversationId,
  getConversationName,
  getConversationPicture,
} from "../../../utils/chat.js";
import SocketContext from "../../../context/SocketContext.js";
import { capitalize } from "../../../utils/string.js";
function Conversation({ conv, socket, online, typing }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  const { token } = user;

  const values = {
    receiver_id: getConversationId(user, conv.users),
    token,
  };
  const openConversation = async () => {
    let newConvo = await dispatch(open_create_conversation(values));
    socket.emit("join conversation", newConvo.payload._id);
  };
  return (
    <li
      onClick={() => openConversation()}
      className={`list-none h-[72px] w-full dark:bg-dark_bg_1 hover:${
        conv._id === activeConversation._id ? "" : "dark:bg-dark_bg_2"
      } cursor-pointer dark:text-dark_text_1 px-[10px] ${
        conv._id === activeConversation._id ? "dark:bg-dark_hover_1" : ""
      }`}
    >
      <div className="relative w-full flex items-center justify-between py-[10px]">
        <div className="flex items-center gap-x-3">
          <div
            className={`relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden ${
              online ? "online" : ""
            }`}
          >
            <img
              src={getConversationPicture(user, conv.users)}
              alt="picture"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full flex flex-col">
            <h1 className="font-bold flex items-center gap-x-2 ">
              {capitalize(getConversationName(user, conv.users))}
            </h1>
            <div>
              <div className="flex items-center gap-x-1 dark:text-dark_text_2">
                <div className="flex-1 items-center gap-x-1 dark:text-dark_text_2">
                  {typing === conv._id ? (
                    <p className="text-green_1">Typing...</p>
                  ) : (
                    <p>
                      {conv.latestMessage?.message.length > 25
                        ? `${conv.latestMessage?.message.substring(0, 25)} ...`
                        : conv.latestMessage?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-4 items-end text-xs">
          <span className="dark:text-dark_text_2">
            {conv.latestMessage?.createdAt
              ? dateHandler(conv.latestMessage.createdAt)
              : ""}
          </span>
        </div>
      </div>
      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
    </li>
  );
}

const ConversationWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Conversation {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ConversationWithSocket;
