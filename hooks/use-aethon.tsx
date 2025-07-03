"use client"

import type React from "react"
import { useState } from "react"
import { aethonAI } from "@/lib/aethon-ai"

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
    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      // Use the enhanced Aethon AI
      const response = await aethonAI.generateResponse(currentInput)
      
      const assistantMessage: Message = {
        role: "assistant",
        parts: [{ type: "text", text: response.text }],
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Aethon error:', error)
      
      const errorMessage: Message = {
        role: "assistant",
        parts: [{ type: "text", text: "I apologize, but I encountered an error. Please try again." }],
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  }
}
