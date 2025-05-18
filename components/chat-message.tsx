import { User, Bot } from "lucide-react"

interface MessagePart {
  type: string
  text?: string
}

interface Message {
  role: "user" | "assistant"
  parts: MessagePart[]
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${message.role === "assistant" ? "bg-muted/50 p-3 rounded-lg" : ""}`}>
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-2">
        <div className="prose-sm prose dark:prose-invert">
          {message.parts.map((part, index) => {
            if (part.type === "text" && part.text) {
              return <div key={index}>{part.text}</div>
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}
