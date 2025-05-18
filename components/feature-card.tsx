import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}

export function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        {icon}
        <CardTitle className="mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pt-0">
        <Button asChild variant="ghost" className="w-full justify-between">
          <Link href={link} className="flex items-center justify-between">
            <span>Learn more</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
