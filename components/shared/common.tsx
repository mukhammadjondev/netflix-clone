'use client'

import { MoviesDataProps } from "@/types"
import Navbar from "./navbar"

interface Props {
  moviesData: MoviesDataProps[]
}

const Common = ({moviesData}: Props) => {
  return (
    <main>
      <Navbar />
    </main>
  )
}

export default Common