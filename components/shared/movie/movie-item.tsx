'use client'

import { MovieProps } from "@/types"
import { ChevronDown, Loader2, MinusIcon, PlusIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface Props {
  movie: MovieProps
}

const MovieItem = ({movie}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)

  return (
    <div className="relative cardWrapper h-28 min-w-[180px] cursor-pointer md:h-36 md:min-w-[260px] transform transition duration-500 hover:scale-110 hover:z-[999]">
      <Image src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/${movie?.backdrop_path || movie?.poster_path}`} alt={"Image"} fill className={`md:rounded object-contain duration-700 ease-in-out ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}`} onLoadingComplete={() => setIsLoading(false)} />

      <div className="space-x-3 hidden absolute p-2 bottom-0 buttonWrapper">
        <button
          className="cursor-pointer border flex p-2 items-center gap-x-2 rounded-full text-sm font-semibold transition hover:opacity-90 border-white bg-black opacity-75 text-black">
          {movie?.addedToFavorites ? (
            <MinusIcon color="#ffffff" className="h-7 w-7" />
          ) : (
            <PlusIcon color="#ffffff" className="h-7 w-7" />
          )}
        </button>
        <button className="cursor-pointer p-2 border flex items-center gap-x-2 rounded-full text-sm font-semibold transition hover:opacity-90 border-white bg-black opacity-75">
          <ChevronDown color="#fff" className="h-7 w-7" />
        </button>
      </div>
    </div>
  )
}

export default MovieItem