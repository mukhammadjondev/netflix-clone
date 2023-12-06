'use client'

import Banner from "@/components/shared/banner"
import Loader from "@/components/shared/loader"
import Login from "@/components/shared/login"
import ManageAccount from "@/components/shared/manage-account"
import MovieItem from "@/components/shared/movie/movie-item"
import Navbar from "@/components/shared/navbar"
import { toast } from "@/components/ui/use-toast"
import { useGlobalContext } from "@/context"
import { getFavourites } from "@/lib/api"
import { FavouriteProps, MovieProps } from "@/types"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Page = () => {
  const [favourites, setFavourites] = useState<FavouriteProps[]>([])

  const {data: session}: any = useSession()
  const {account, setPageLoader, pageLoader} = useGlobalContext()
  const router = useRouter()

  useEffect(() => {
    const getData = async () => {
      try {
        const {data} = await getFavourites(session?.user?.uid, account?._id)
        setFavourites(data)
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

    if(session && account) {
      getData()
    }
  }, [session, account])

  if(session === null) return <Login />
  if(account === null) return <ManageAccount />
  if(pageLoader) return <Loader />

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <div className="ml-6 mx-4">
        {favourites && favourites.length === 0 ? (
          <div className="lg:px-24 lg:py-24 md:py-20 md:px-24 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
            <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
              <div className="relative">
                <h1 className="my-2 text-gray-100 font-bold text-2xl">
                  Looks like you don't have any favourites yet!
                </h1>
                <p className="my-2 text-gray-300">
                  Sorry about that! Please visit our hompage to get where you need to go.
                </p>
                <button className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50"
                  onClick={() => {
                    setPageLoader(true)
                    router.push("/")
                  }}
                >
                  Take me there!
                </button>
              </div>
            </div>
            <div>
              <img src="https://i.ibb.co/ck1SGFJ/Group.png" />
            </div>
          </div>
        ) : (
          <>
            {/* @ts-ignore */}
            <Banner movies={favourites as MovieProps[]} />
            <div className="h-40 space-y-0.5 md:space-y-2 px-4">
              <h2 className="cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl">
                My list
              </h2>

              <div className="group relative md:-ml-2 pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {favourites && favourites.map(((fav: FavouriteProps) => (
                    <MovieItem
                      key={fav.movieId}
                      movie={{
                        backdrop_path: fav.backdrop_path,
                        poster_path: fav.poster_path,
                        id: +fav.movieId as number,
                        type: fav.type,
                        title: fav.title,
                        overview: fav.overview,
                      } as MovieProps}
                      favouriteId={fav?._id}
                      setFavourites={setFavourites}
                    />
                  ))).reverse()}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default Page