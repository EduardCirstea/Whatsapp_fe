import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Add from "./Add.jsx";
import SendIcon from "../../../../svg/Send.js";
import { uploadFiles } from "../../../../utils/upload.js";
import {
  removeFilefromFiles,
  sendMessage,
} from "../../../../features/chatSlice.js";
import SocketContext from "../../../../context/SocketContext.js";
import { ClipLoader } from "react-spinners";
import CloseIcon from "../../../../svg/Close.js";
import VideoThumbnail from "react-video-thumbnail";

function HandleAndSend({ activeIndex, setActiveIndex, message, socket }) {
  const [loading, setLoading] = useState(false);
  const { files, activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const dispatch = useDispatch();
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const uploaded_files = await uploadFiles(files);
    const values = {
      token,
      message,
      convo_id: activeConversation._id,
      files: uploaded_files.length > 0 ? uploaded_files : [],
    };
    let newMsg = await dispatch(sendMessage(values));
    socket.emit("send message", newMsg.payload);
    setLoading(false);
  };

  const handleRemoveFile = (index) => {
    dispatch(removeFilefromFiles(index));
  };
  return (
    <div className="w-[97%] flex items-center justify-between mt-2 border-t dark:border-dark_border_2">
      <span></span>
      <div className="flex items-center gap-x-2">
        {files.map((file, i) => (
          <div
            key={i}
            className={`fileThumbnail relative w-14 h-14 border dark:border-white mt-2 rounded-md overflow-hidden cursor-pointer
              ${activeIndex === i ? "border-[3px] !border-green_1" : ""}`}
            onClick={() => setActiveIndex(i)}
          >
            {file.type === "IMAGE" ? (
              <img
                className="w-full h-full object-cover"
                src={file.fileData}
                alt="file"
              />
            ) : file.type === "VIDEO" ? (
              <VideoThumbnail videoUrl={file.fileData} />
            ) : (
              <img
                src={`../../../../images/file/${file.type}.png`}
                alt=""
                className="w-8 h-10 mt-1.5 ml-2.5"
              />
            )}
            <div
              className="removeFileIcon hidden"
              onClick={() => handleRemoveFile(i)}
            >
              <CloseIcon className="dark:fill-white absolute right-0 top-0 w-4 h-4" />
            </div>
          </div>
        ))}
        <Add setActiveIndex={setActiveIndex} />
      </div>
      <div
        onClick={(e) => sendMessageHandler(e)}
        className="bg-green_1 w-16 h-16 mt-2 rounded-full flex items-center justify-center cursor-pointer"
      >
        {loading ? (
          <ClipLoader color="#E9EDEF" size={25} />
        ) : (
          <SendIcon className="fill-white" />
        )}
      </div>
    </div>
  );
}

const HandleAndSendSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <HandleAndSend {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default HandleAndSendSocket;
