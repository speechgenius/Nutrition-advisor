"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Stethoscope, User, Send, Menu } from 'lucide-react'

export default function HealthChat() {
  const [messages, setMessages] = useState([
    { id: 1, content: "Hello! How can I assist you with your health today?", sender: "ai" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim()) {
      // Add user's message
      const userMessage = { id: messages.length + 1, content: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      try {
        // Send message to AI backend
        // const response = await fetch('http://localhost:3001/api/ai-response', {
        const response = await fetch('https://050f-197-250-226-241.ngrok-free.app/afya/respond', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input }),  // Ensure your backend expects this format
        });

        // Parse and display AI response
        if (response.ok) {
          const data = await response.json();
          // if (data.reply) {  // Ensure 'reply' exists in the response
          if(data.message){
            const aiMessage = { id: messages.length + 2, content: data.message, sender: "ai" };
            console.log('AI Response:', aiMessage.messsage);
            setMessages((prevMessages) => [...prevMessages, aiMessage]);
          } else {
            console.error('No reply in response:', data);
          }
        } else {
          console.error('Error fetching AI response:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-4">
          <h2 className="text-xl font-bold">Quick Actions</h2>
        </div>
        <nav className="flex-1">
          <Button variant="ghost" className="w-full justify-start">
            <Activity className="mr-2 h-4 w-4" />
            Chat with EatWise AI
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Stethoscope className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">EATWISE AI</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`px-[20px] flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your health question..."
              className="flex-1"
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t p-4 text-center text-sm text-gray-500">
          HealthChat AI is not a substitute for professional medical advice, diagnosis, or treatment.
        </footer>
      </div>
    </div>
  )
}
