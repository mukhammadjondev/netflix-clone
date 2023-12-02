'use client'

import Common from "@/components/shared/common"
import Loader from "@/components/shared/loader"
import Login from "@/components/shared/login"
import ManageAccount from "@/components/shared/manage-account"
import { useGlobalContext } from "@/context"
import { getPopularMovies, getTopRatedMovies, getTrendingMovies } from "@/lib/api"
import { MovieProps, MoviesDataProps } from "@/types"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from "react"

const Page = () => {
  const [moviesData, setMoviesData] = useState<MoviesDataProps[]>([])

  const {account, pageLoader, setPageLoader} = useGlobalContext()
  const {data: session} = useSession()

  useEffect(() => {
    const getAllMoives = async () => {
      try {
        const [trendingTv, topRatedTv, popularTv, trendingMovie, topRatedMovie, popularMovie] = await Promise.all([
          getTrendingMovies('tv'),
          getTopRatedMovies('tv'),
          getPopularMovies('tv'),

          getTrendingMovies('movie'),
          getTopRatedMovies('movie'),
          getPopularMovies('movie'),
        ])

        const tvShows: MoviesDataProps[] = [
          {title: 'Trending TV Shows', data: trendingTv},
          {title: 'Top Rated TV Shows', data: topRatedTv},
          {title: 'Popular TV Shows', data: popularTv}
        ].map(item => ({...item, data: item.data.map((movie: MovieProps) => ({...movie, type: 'tv', addedToFavorites: false}))}))

        const movieShows: MoviesDataProps[] = [
          {title: 'Trending Movie', data: trendingMovie},
          {title: 'Top Rated Movie', data: topRatedMovie},
          {title: 'Popular Movie', data: popularMovie}
        ].map(item => ({...item, data: item.data.map((movie: MovieProps) => ({...movie, type: 'movie', addedToFavorites: false}))}))

        const allMovies = [...movieShows, ...tvShows]
        setMoviesData(allMovies)
      } catch (err) {
        console.log(err)
      } finally {
        setPageLoader(false)
      }
    }

    getAllMoives()
  }, [])

  if(session === null) return <Login />
  if(account === null) return <ManageAccount />
  if(pageLoader) return <Loader />

  return <Common moviesData={moviesData} />
}

export default Page