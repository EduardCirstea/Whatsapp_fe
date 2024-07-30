import { useSelector } from "react-redux";
import Conversation from "./Conversation";
export default function Conversations() {
  const { conversations } = useSelector((state) => state.chat);

  return (
    <div className="convos scrollbar">
      <ul>
        {conversations &&
          conversations.map((conv, i) => (
            <Conversation conv={conv} key={conv._id} />
          ))}
      </ul>
    </div>
  );
}
