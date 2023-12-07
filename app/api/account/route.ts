import Account from "@/database/account"
import { connectToDatabase } from "@/lib/mongoose"
import { NextResponse } from "next/server"
import { hash } from 'bcryptjs'

export const dynamic = 'force-dynamic'

// Create a new account
export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const {name, pin, uid} = await req.json()

    const isExist = await Account.findOne({name})
    const allAccounts = await Account.find({uid})

    if(isExist) {
      return NextResponse.json({success: false, message: 'You already have an account'})
    }

    if(allAccounts && allAccounts.length === 4) {
      return NextResponse.json({success: false, message: 'You can only have 4 accounts'})
    }

    const hashPin = await hash(pin, 10)

    const account = await Account.create({name, uid, pin: hashPin})

    return NextResponse.json({success: true, data: account})
  } catch (err) {
    return NextResponse.json({success: false, message: 'Something went wrong'})
  }
}

// Get all accounts
export async function GET(req: Request) {
  try {
    await connectToDatabase()

    const {searchParams} = new URL(req.url)
    const uid = searchParams.get('uid')

    if(!uid) {
      return NextResponse.json({success: false, message: 'Account id is mandatory'})
    }

    const accounts = await Account.find({uid})

    return NextResponse.json({success: true, data: accounts})
  } catch (err) {
    return NextResponse.json({success: false, message: 'Something went wrong'})
  }
}

// Delete an account
export async function DELETE(req: Request) {
  try {
    await connectToDatabase()

    const {searchParams} = new URL(req.url)
    const id = searchParams.get('id')

    if(!id) {
      return NextResponse.json({success: false, message: 'Account id is mandatory'})
    }

    await Account.findByIdAndDelete(id)

    return NextResponse.json({success: true, message: 'Account delete successfully'})
  } catch (err) {
    return NextResponse.json({success: false, message: 'Something went wrong'})
  }
}