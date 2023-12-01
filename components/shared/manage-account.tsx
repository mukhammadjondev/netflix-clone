import { AccountProps, AccountResponse } from "@/types"
import { Trash2, LockKeyhole } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from 'react'
import CreateAccountForm from "../form/create-account-form"
import LoginAccountForm from "../form/login-account-form"
import { Button } from "../ui/button"
import { Dialog, DialogContent } from "../ui/dialog"
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from "../ui/use-toast"
import { Skeleton } from "../ui/skeleton"

const ManageAccount = () => {
  const [isDelete, setIsDelete] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [state, setState] = useState<'login' | 'create'>('create')
  const [accounts, setAccounts] = useState<AccountProps[]>([])
  const [currentAccount, setCurrentAccount] = useState<AccountProps | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const {data: session}: any = useSession()

  useEffect(() => {
    const getAllAccounts = async () => {
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
  }, [session])

  const onDelete = async (id: string) => {
    try {
      const isConfirmed = confirm('Are you sure you want to delete this account?')
      if(isConfirmed) {
        const {data} = await axios.delete<AccountResponse>(`/api/account?id=${id}`)
        if(data.success) {
          setAccounts(accounts.filter(account => account._id !== id))
          return toast({
            title: 'Account deleted successfully',
            description: 'Your account has been deleted successfully'
          })
        } else {
          return toast({
            title: 'Error',
            description: data.message,
            variant: 'destructive'
          })
        }
      }
    } catch (err) {
      return toast({
        title: 'Error',
        description: 'An error occured while deleting your account',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-white text-5xl font-bold my-10 text-center">Who's Watching?</h1>

        <ul className="flex p-0 my-10 gap-6 flex-col sm:flex-row">
          {isLoading ? (
            [1, 2, 3, 4].map(c => (
              <Skeleton key={c} className="h-[155px] w-[155px] cursor-pointer flex flex-col items-center gap-3 rounded" />
            ))
          ) : (
            <>
              {accounts.map(account => (
                <li key={account._id} onClick={() => {
                  if(isDelete) return
                  setOpen(true)
                  setState('login')
                  setCurrentAccount(account)
                }} className="w-[155px] cursor-pointer flex flex-col items-center gap-3 rounded">
                <div className="relative">
                  <div className="rounded object-cover w-[155px] h-[155px] relative">
                    <Image src='https://t.ly/9eB20' alt="account" fill className="rounded" />
                  </div>
                  {isDelete ? (
                    <div onClick={() => onDelete(account._id)} className="absolute transform z-10 bottom-0 cursor-pointer">
                      <Trash2 className="w-8 h-8 text-red-600" />
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-mono font-bold text-xl">{account.name}</span>
                  <LockKeyhole />
                </div>
              </li>
              ))}

              {accounts && accounts.length < 4 ? (
                <li onClick={() => {
                    setOpen(true)
                    setState('create')
                  }}
                  className={"border bg-[#e5b109] font-bold text-xl border-black max-w-[200px] rounded w-[155px] h-[155px] cursor-pointer flex justify-center items-center"} >
                    Add account
                </li>
              ) : null}
            </>
          )}
        </ul>

        <Button onClick={() => setIsDelete(prev => !prev)} className={"bg-transparent rounded-none hover:bg-transparent !text-white border border-gray-100 cursor-pointer tracking-wide inline-flex text-sm px-[1.5em] py-[0.5em] mb-10"}>
          Manage Profiles
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {state === 'create' && <CreateAccountForm uid={session?.user?.uid} setOpen={setOpen} setAccounts={setAccounts} accounts={accounts} />}
          {state === 'login' && <LoginAccountForm currentAccount={currentAccount} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ManageAccount