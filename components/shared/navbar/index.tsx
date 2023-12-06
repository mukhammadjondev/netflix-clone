'use client'

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { menuItems } from "@/constants"
import { useGlobalContext } from "@/context"
import { cn } from "@/lib/utils"
import { AccountProps, AccountResponse } from "@/types"
import axios from "axios"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import MoviePopup from "../movie/movie-popup"
import SearchBar from "./search-bar"

const Navbar = () => {
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [accounts, setAccounts] = useState<AccountProps[]>([])

  const {account, setAccount, setPageLoader} = useGlobalContext()
  const {data: session}: any = useSession()
  const router = useRouter()

  const logout = () => {
    sessionStorage.removeItem('account')
    signOut()
    setAccount(null)
  }

  useEffect(() => {
    const getAllAccounts = async () => {
      setIsLoading(true)
      try {
        const {data} = await axios.get<AccountResponse>(`/api/account?uid=${session?.user?.uid}`)
        data.success && setAccounts(data.data as AccountProps[])
      } catch (err) {
        return toast({
          title: 'Error',
          description: 'An error occured while creating your account',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }
    getAllAccounts()

    const handleScroll = () => {
      if(window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative">
      <header className={cn("header h-[10vh] hover:bg-black transition-all duration-400 ease-in-out",  isScrolled && "bg-black")}>
        <div className="flex items-center h-full space-x-2 md:space-x-10">
          <Image src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
            width={120}
            height={120}
            alt="NETFLIX"
            className="cursor-pointer object-contain"
            onClick={() => {
              router.push("/browse")
              setPageLoader(true)
            }}
          />

          <ul className={"hidden md:space-x-4 md:flex cursor-pointer"}>
            {menuItems.map(item => (
              <li onClick={() => {
                router.push(item.path)
                setPageLoader(true)
              }} key={item.path} className={"cursor-pointer text-[16px] font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]"}>
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        <MoviePopup />

        <div className="flex items-center relative font-light space-x-4 text-sm">
          {showSearchBar ? (
            <SearchBar setShowSearchBar={setShowSearchBar} />
          ) : (
            <AiOutlineSearch onClick={() => setShowSearchBar(prev => !prev)} className="hidden sm:inline sm:w-6 sm:h-6 cursor-pointer" />
          )}

          <Popover>
            <PopoverTrigger>
              <div className="flex gap-2 items-center cursor-pointer">
                <img src="https://t.ly/9eB20" alt="Current Profile" className="rounded object-cover w-[30px] h-[30px]" />
                <p>{account && account.name}</p>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <>
                {isLoading ? (
                  <div className="flex flex-col space-y-4">
                    {[1, 2].map(c => (
                      <Skeleton className="w-full h-14" key={c} />
                    ))}
                  </div>
                ) : (
                  accounts && accounts.map(account => (
                    <div key={account._id} className="cursor-pointer flex h-14 gap-3 hover:bg-slate-800 rounded-md items-center px-4 py-2" onClick={() => {
                      setAccount(null)
                      sessionStorage.removeItem('account')
                    }}>
                      <img src="https://t.ly/9eB20" alt="profile" className="rounded object-cover w-[30px] h-[30px]" />
                      <p>{account.name}</p>
                    </div>
                  ))
                )}
                <button onClick={logout} className={"mt-4 text-center w-full text-sm font-light hover:bg-slate-800 rounded-md py-2 border border-white/40 h-[40px]"} >
                  Sign out of Netflix
                </button>
              </>
            </PopoverContent>
          </Popover>
        </div>
      </header>
    </div>
  )
}

export default Navbar