import { Trash2, LockKeyhole } from "lucide-react"
import Image from "next/image"
import { useState } from 'react'
import CreateAccountForm from "../form/create-account-form"
import LoginAccountForm from "../form/login-account-form"
import { Button } from "../ui/button"
import { Dialog, DialogContent } from "../ui/dialog"

const ManageAccount = () => {
  const [isDelete, setIsDelete] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [state, setState] = useState<'login' | 'create'>('create')

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-white text-5xl font-bold my-10 text-center">Who's Watching?</h1>

        <ul className="flex p-0 my-10 gap-6 flex-col sm:flex-row">
          <li onClick={() => {
              setOpen(true)
              setState('login')
            }} className="max-w-[220px] w-[155px] cursor-pointer flex flex-col items-center gap-3 rounded">
            <div className="relative">
              <div className="max-w-[200px] min-w-[84px] max-h-[200px] min-h-[84px] rounded object-cover w-[155px] h-[155px] relative">
                <Image src='https://t.ly/9eB20' alt="account" fill className="rounded" />
              </div>
              {isDelete ? (
                <div className="absolute transform z-10 bottom-0 cursor-pointer">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-1">
              <span className="font-mono font-bold text-xl">Mukhammadjon</span>
              <LockKeyhole />
            </div>
          </li>

          <li onClick={() => {
              setOpen(true)
              setState('create')
            }}
            className={"border bg-[#e5b109] font-bold text-xl border-black max-w-[200px] rounded min-w-[84px] max-h-[200px] min-h-[84px] w-[155px] h-[155px] cursor-pointer flex justify-center items-center"} >
              Add account
          </li>
        </ul>

        <Button onClick={() => setIsDelete(prev => !prev)} className={"bg-transparent rounded-none hover:bg-transparent !text-white border border-gray-100 cursor-pointer tracking-wide inline-flex text-sm px-[1.5em] py-[0.5em] mb-10"}>
          Manage Profiles
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {state === 'create' && <CreateAccountForm />}
          {state === 'login' && <LoginAccountForm />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ManageAccount