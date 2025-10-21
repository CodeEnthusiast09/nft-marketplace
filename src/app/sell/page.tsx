"use client";

import { Card } from "@/components/card";
import { CardHeader } from "@/components/card/card-header";
import { motion } from "framer-motion";
import { FaUpload } from "react-icons/fa6";
import { FaDollarSign } from "react-icons/fa";
import { ListNftForm } from "./_components/list-nft-form";
import { WithdrawProceedsForm } from "./_components/withdraw-proceeds";

export default function Sell() {
  const steps = [
    {
      number: 1,
      title: "Approve NFT",
      description:
        "Grant the marketplace permission to transfer your NFT when it sells.",
    },
    {
      number: 2,
      title: "List Your NFT",
      description:
        "Set your price and payment token, then list your NFT on the marketplace.",
    },
    {
      number: 3,
      title: "Withdraw Earnings",
      description:
        "After your NFT sells, withdraw your proceeds to your wallet anytime.",
    },
  ];

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Sell Your NFTs</h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
          List your NFTs for sale and manage your earnings easily.
        </p>
      </div>

      {/* Action cards */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="mt-6 !border-primary-500">
          <div className="flex items-start gap-5">
            <div className="flex flex-shrink-0 h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10">
              <FaUpload size={22} className="text-primary-500" />
            </div>
            <CardHeader
              title="List NFT"
              description="Put your NFT up for sale on the marketplace."
            />
          </div>

          <ListNftForm />

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-10">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How listing Work</p>
                <ul className="space-y-1 text-xs">
                  <li>
                    • Enter NFT details (address, token ID, price, payment
                    token)
                  </li>
                  <li>
                    • Click &quot;Approve NFT&quot; → Approve marketplace to
                    transfer NFT
                  </li>
                  <li>
                    • Click &quot;List NFT&quot; → Create listing on marketplace
                  </li>
                  <li>• Form resets on success</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mt-6 !border-primary-500">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10">
              <FaDollarSign size={22} className="text-primary-500" />
            </div>
            <CardHeader
              title="Withdraw Proceeds"
              description="Claim your earnings from NFT sales."
            />
          </div>

          <WithdrawProceedsForm />
        </Card>
      </div>

      {/* Steps section */}
      <Card className="mt-12 py-6 !bg-primary-100 !border-primary-500">
        <CardHeader
          title="How it works"
          description="Follow these simple steps to start selling your NFTs."
        />

        <div className="grid gap-8 md:grid-cols-3 mt-6">
          {steps.map((step) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: step.number * 0.1 }}
              className="relative bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-600 text-background font-bold text-sm shadow-md">
                {step.number}
              </div>

              <div className="pt-4 space-y-2">
                <h3 className="font-semibold text-base">{step.title}</h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
