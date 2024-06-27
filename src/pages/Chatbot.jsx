import React, { useState } from "react";
import axios from "axios";
import Switcher from "../components/Switcher";

const Chatbot = () => {
  const [input, setInput] = useState({
    senderID: "6673f7c25a7da01a3cdd69c0",
    content: "",
  });

  const handleMessageChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      if (input.content === null || input.content === "") {
        console.log({ err: "the content of request is empty" });
      } else {
        const response = await axios.post(
          "http://localhost:3400/api/message",
          input
        );
      }
      console.log(response.data.responseSaved.content);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-50 flex dark:bg-gray-900">
      <div className="sidBar w-2/6 h-full border "></div>
      <div className="main_container h-full w-4/6 ">
        <div className="main_nav border h-24">
          <Switcher />
        </div>
        <div className="main">
          <form onSubmit={handleLoginSubmit}>
            <input
              name="content"
              value={input.content}
              id="content"
              onChange={handleMessageChange}
              type="text"
            />
            <button type="submit">submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
