import Account from "@/database/account"
import { connectToDatabase } from "@/lib/mongoose"
import { NextResponse } from "next/server"
import { hash } from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const {name, pin, uid} = await req.json()

    const isExist = await Account.findOne({name})
    const allAccounts = await Account.find({uid})
    console.log(allAccounts)

    if(isExist) {
      return NextResponse.json({success: false, message: 'You already have an account'})
    }

    if(allAccounts && allAccounts.length === 4) {
      return NextResponse.json({success: false, message: 'You can only have 4 accounts'})
    }

    const hashPin = await hash(pin, 10)

    const account = await Account.create({name, uid, pin: hashPin})

    return NextResponse.json({account})
  } catch (err) {
    return NextResponse.json({success: false, message: 'Something went wrong'})
  }
}