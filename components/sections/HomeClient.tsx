'use client'

type HomeClientProps = {
  name: string
  description: string
}

export function HomeClient({ name, description }: HomeClientProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        {name}
      </h1>
      <h2 className="mt-4 text-xl font-medium text-foreground/60">
        {description}
      </h2>
    </main>
  )
}
