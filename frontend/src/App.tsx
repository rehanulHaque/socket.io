import { FormEvent, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export default function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState<string | undefined>("");
  const [messages, setMessages] = useState<string[]>([]);

  const handelClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    socket.emit("send_message", {message, room});
  };
  const handelRoom = (e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    socket.emit("join_room", room)
  }


  useEffect(() => {
    socket.on("connect", ()=>{
      setSocketId(socket.id);
    })
    socket.on("welcome", (data) => {
      console.log(data);
    });

    socket.on("receive_message", (data) => {
      console.log(data);
      setMessages((prev)=>[...prev, data])
    });
    return ()=>{
      socket.disconnect()
    }
  }, []);


  return (
    <div>
      {socketId && <h1>{socketId}</h1>}
      <form onSubmit={handelRoom}>
      <input
          type="text"
          placeholder="Room"
          onChange={(e) => setRoom(e.target.value)}
          value={room}
        />
        <button>Join</button>
      </form>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <form onSubmit={handelClick}>
      
        <input
          type="text"
          placeholder="Message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button>Send</button>
      </form>

      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
}
