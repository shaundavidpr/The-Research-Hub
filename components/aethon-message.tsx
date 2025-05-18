import { User, Sparkles } from "lucide-react"

interface MessagePart {
  type: string
  text?: string
}

interface Message {
  role: "user" | "assistant"
  parts: MessagePart[]
}

interface AethonMessageProps {
  message: Message
}

export function AethonMessage({ message }: AethonMessageProps) {
  return (
    <div
      className={`flex gap-3 ${
        message.role === "assistant" ? "bg-muted/50 p-4 rounded-lg border border-border/50" : ""
      }`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full ${
          message.role === "assistant" ? "bg-primary/20" : "border bg-background shadow"
        }`}
      >
        {message.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-primary" />}
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
