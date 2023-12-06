'use client'

import Loader from "@/components/shared/loader"
import Login from "@/components/shared/login"
import ManageAccount from "@/components/shared/manage-account"
import MovieItem from "@/components/shared/movie/movie-item"
import Navbar from "@/components/shared/navbar"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { useGlobalContext } from "@/context"
import { getSearchResults } from "@/lib/api"
import { MovieProps } from "@/types"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const Page = () => {
  const [movies, setMovies] = useState<MovieProps[]>([])

  const {data: session}: any = useSession()
  const {account, setPageLoader, pageLoader} = useGlobalContext()
  const params = useParams()

  useEffect(() => {
    const getData = async () => {
      try {
        const [tv, movies] = await Promise.all([
          getSearchResults('tv', params.query as string),
          getSearchResults('movie', params.query as string)
        ])

        const tvShows = tv
          .filter((item: MovieProps) => item.backdrop_path !== null && item.poster_path !== null)
          .map((movie: MovieProps) => ({...movie, type: 'tv'}))

        const moviesShow = movies
          .filter((item: MovieProps) => item.backdrop_path !== null && item.poster_path !== null)
          .map((movie: MovieProps) => ({...movie, type: 'movie'}))

        setMovies([...tvShows, ...moviesShow])

      } catch (err) {
        return toast({
          title: 'Error',
          description: 'Something went wrong',
          variant: 'destructive'
        })
      } finally {
        setPageLoader(false)
      }
    }

    getData()
  }, [])

  if(session === null) return <Login />
  if(account === null) return <ManageAccount />
  if(pageLoader) return <Loader />

  return (
    <motion.div initial={{opacity: 0}} whileInView={{opacity: 1}} viewport={{once: true}} >
      <Navbar />
      <div className="my-20 space-y-0.5 md:space-y-2 px-4 md:px-10">
        <h2 className="cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl">
          Showing Results for {decodeURI(params.query as string)}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center scrollbar-hide md:p-2">
          {movies && movies.length ? movies.map((movie) => (
            <MovieItem key={movie.id} movie={movie} />
          )) : null}
        </div>
      </div>
    </motion.div>
  )
}

export default Page