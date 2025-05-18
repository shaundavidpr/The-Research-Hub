"use client"

import type React from "react"
import { useState } from "react"

interface MessagePart {
  type: string
  text?: string
}

interface Message {
  role: "user" | "assistant"
  parts: MessagePart[]
}

export function useAethon() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      parts: [{ type: "text", text: input }],
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      // This would normally be an API call to an AI service
      const aiResponses: Record<string, string> = {
        "Summarize the key findings from my latest uploaded papers":
          "I don't see any uploaded papers in your account yet. Once you upload research papers to your files section, I can analyze them and provide a summary of key findings. Would you like me to guide you through the process of uploading and organizing your research papers?",

        "Generate a literature review outline for my research topic":
          "I'd be happy to help create a literature review outline. To provide a tailored outline, I need to know your specific research topic. Could you share what area you're researching? Once you provide that information, I can generate a comprehensive literature review structure with relevant sections and subsections.",

        "Suggest research questions based on gaps in the current literature":
          "To suggest targeted research questions based on literature gaps, I'll need more information about your research domain and interests. What specific field or topic are you investigating? With that context, I can identify potential gaps and formulate research questions that address unexplored areas in the current literature.",
      }

      // Default response for inputs not in our predefined list
      const responseText =
        aiResponses[input.trim()] ||
        "I'm Aethon, your research assistant. I can help analyze papers, generate literature reviews, suggest research questions, and organize your research materials. To provide more specific assistance, could you tell me more about your research topic and what you're working on?"

      const assistantMessage: Message = {
        role: "assistant",
        parts: [{ type: "text", text: responseText }],
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  }
}
