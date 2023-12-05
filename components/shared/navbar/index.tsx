import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { menuItems } from "@/constants"
import { useGlobalContext } from "@/context"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import MoviePopup from "../movie/movie-popup"
import SearchBar from "./search-bar"

const Navbar = () => {
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)

  const {account, setAccount, setPageLoader} = useGlobalContext()
  const router = useRouter()

  const logout = () => {
    sessionStorage.removeItem('account')
    signOut()
    setAccount(null)
  }

  useEffect(() => {
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
              <button onClick={logout} className={"mt-4 text-center w-full text-sm font-light hover:bg-slate-800 rounded-md py-2 border border-white/40 h-[40px]"} >
                Sign out of Netflix
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </header>
    </div>
  )
}

export default Navbar