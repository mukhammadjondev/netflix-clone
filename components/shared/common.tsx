'use client'

import { MoviesDataProps } from "@/types"
import Banner from "./banner"
import MovieRow from "./movie/movie-row"
import Navbar from "./navbar"

interface Props {
  moviesData: MoviesDataProps[]
}

const Common = ({moviesData}: Props) => {
  return (
    <main>
      <Navbar />

      <div className="relative pb-24 pl-4 lg:space-y-24">
        <Banner movies={moviesData && moviesData[0].data} />

        <section className="md:space-y-16">
          {moviesData && moviesData.map(movie => (
            <MovieRow title={movie.title} data={movie.data} key={movie.title} />
          ))}
        </section>
      </div>
    </main>
  )
}

export default Common