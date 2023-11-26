import Image from "next/image"
import { Button } from "../ui/button"
import { AiFillGithub } from 'react-icons/ai'
import {signIn} from "next-auth/react"

const Login = () => {
  return (
    <div className="w-full h-screen">
      <div className="absolute inset-0">
        <Image src="https://repository-images.githubusercontent.com/299409710/b42f7780-0fe1-11eb-8460-e459acd20fb4" alt="bg" fill />
      </div>
      <div className="relative z-10 rounded-md w-[500px] h-[50vh] bg-black/60 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-4">
        <div className="flex h-full justify-center items-center">
          <Button onClick={() => signIn('github')} className="flex items-center gap-2 w-full h-[56px] bg-red-600 !text-white hover:bg-red-500">
            <AiFillGithub className="w-7 h-7" />
            Sign in with Github
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login