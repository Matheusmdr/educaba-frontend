"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Search } from "lucide-react"

interface SearchInputProps {
  placeholder?: string
  defaultValue?: string
  className?: string
  searchParamName?: string
  showSearchButton?: boolean
  onSearch?: (value: string) => void
}

export function SearchInput({
  placeholder,
  defaultValue,
  className,
  searchParamName = "search",
  showSearchButton = true,
  onSearch,
}: SearchInputProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(defaultValue || "")

  const updateSearchParams = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams)
      if (term) {
        params.set(searchParamName, term)
      } else {
        params.delete(searchParamName)
      }

      router.replace(`?${params.toString()}`)
      onSearch?.(term)
    },
    [router, searchParams, searchParamName, onSearch]
  )

  const handleSearchButtonClick = useCallback(() => {
    updateSearchParams(searchTerm)
  }, [searchTerm, updateSearchParams])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleSearchButtonClick()
      }
    },
    [handleSearchButtonClick]
  )



  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className={className}
      />
      {showSearchButton && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleSearchButtonClick}
          className="shrink-0 bg-transparent"
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
