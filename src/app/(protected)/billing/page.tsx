"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { createCheckoutSession } from "@/lib/stripe"
import { api } from "@/trpc/react"
import { Info } from "lucide-react"
import { useState } from "react"

const BillingPage = () => {
  const {data: user} = api.project.getMyTokens.useQuery()
  const [tokensToBuy, setTokensToBuy] = useState<number[]>([100])
  const tokensToBuyAmount = tokensToBuy[0]!
  const price = (tokensToBuyAmount / 50).toFixed(2)
  return (
    <div>
      <h1>Billing</h1>
      <div className="h-2"></div>
      <p className="text-sm">
        You currently have {user?.tokens} tokens
      </p>
      <div className="h-2"></div>
      <div className="p-2 rounded-md bg-blue-50 border border-blue-200 text-blue-700 dark:text-black">
        <div className="flex items-center gap-2">
          <Info className="size-4"/>
          <p>Each tokens allows you to index 1 file in a repository</p>
        </div>
        <p className="text-sm">E.g. If your project has 100 files, you will need 100 tokens to index it</p>
      </div>
      <div className="h-4"></div>
      <Slider defaultValue={[100]} max={1000} min={10} step={10} onValueChange={(value) => setTokensToBuy(value)} value={tokensToBuy}/>
        <div className="h-4"></div>
        <Button onClick={() => createCheckoutSession(tokensToBuyAmount)}>
          Buy {tokensToBuyAmount} for ${price}
        </Button>
    </div>
  )
}

export default BillingPage