import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import API_URL from "./config.js";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      console.log("Fetching threads from:", `${API_URL}/api/thread`);
      const response = await fetch(`${API_URL}/api/thread`);

      if (!response.ok) {
        console.error("Failed to fetch threads:", response.status);
        setAllThreads([]);
        return;
      }

      const res = await response.json();
      console.log("Threads fetched:", res);

      if (Array.isArray(res)) {
        const filteredData = res.map((thread) => ({
          threadId: thread.threadId,
          title: thread.title,
        }));
        setAllThreads(filteredData);
      } else {
        console.error("Response is not an array:", res);
        setAllThreads([]);
      }
    } catch (err) {
      console.error("Error fetching threads:", err);
      setAllThreads([]);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(`${API_URL}/api/thread/${newThreadId}`);

      if (!response.ok) {
        console.error("Failed to fetch thread:", response.status);
        return;
      }

      const res = await response.json();
      console.log("Thread messages:", res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.error("Error fetching thread:", err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`${API_URL}/api/thread/${threadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete thread:", response.status);
        return;
      }

      const res = await response.json();
      console.log("Thread deleted:", res);

      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId),
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.error("Error deleting thread:", err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src="/blacklogo.png" alt="gpt logo" className="logo"></img>
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            onClick={(e) => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : " "}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>By Nexus Chat &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;
