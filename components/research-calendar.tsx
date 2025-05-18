export function ResearchCalendar() {
  // This would normally be dynamic data from an API or state management
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const events = [
    { day: 5, title: "Literature Review Meeting", time: "10:00 AM", type: "meeting" },
    { day: 10, title: "Data Collection", time: "All day", type: "task" },
    { day: 15, title: "Research Seminar", time: "2:00 PM", type: "event" },
    { day: 18, title: "Supervisor Check-in", time: "11:30 AM", type: "meeting" },
    { day: 25, title: "Literature Review Draft Due", time: "11:59 PM", type: "deadline" },
  ]

  // Get event for a specific day
  const getEvent = (day: number) => events.find((event) => event.day === day)

  // Get class for event type
  const getEventClass = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "task":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "event":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "deadline":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Day headers */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="text-center font-medium py-2">
          {day}
        </div>
      ))}

      {/* Empty cells for days before the 1st */}
      {Array.from({ length: 3 }, (_, i) => (
        <div key={`empty-${i}`} className="h-24 border rounded-md bg-muted/20"></div>
      ))}

      {/* Calendar days */}
      {days.map((day) => {
        const event = getEvent(day)

        return (
          <div key={day} className="h-24 border rounded-md p-1 relative">
            <div className="text-sm font-medium">{day}</div>

            {event && (
              <div className={`mt-1 p-1 text-xs rounded ${getEventClass(event.type)}`}>
                <div className="font-medium">{event.title}</div>
                <div>{event.time}</div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
