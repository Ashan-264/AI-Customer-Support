"use client";
import { useState, useEffect, useRef } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I’m Pentagram Customer Support agent. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const endRef = useRef(null);

  // Scroll down whenever messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    // Add user message
    setMessages((m) => [...m, { role: "user", content: message }]);
    setMessage("");

    // Call your API
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const reply = res.ok ? await res.text() : "Sorry, something went wrong.";

    // Add assistant reply
    setMessages((m) => [...m, { role: "assistant", content: reply }]);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        bgcolor: "#f0f2f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          height: "80vh",
          bgcolor: "#fff",
          boxShadow: 3,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Headstarter Support
        </Box>

        {/* Message list */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                alignSelf: msg.role === "assistant" ? "flex-start" : "flex-end",
                bgcolor: msg.role === "assistant" ? "grey.100" : "primary.main",
                color: msg.role === "assistant" ? "text.primary" : "#fff",
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: "75%",
                boxShadow: 1,
              }}
            >
              <Typography variant="body1">{msg.content}</Typography>
            </Box>
          ))}
          <div ref={endRef} />
        </Box>

        {/* Input area */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            borderTop: "1px solid #e0e0e0",
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disableElevation
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
