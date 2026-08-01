import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center text-foreground">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Button asChild className="mt-2">
        <Link to="/">Return home</Link>
      </Button>
    </div>
  )
}
