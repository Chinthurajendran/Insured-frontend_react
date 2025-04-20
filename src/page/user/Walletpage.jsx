import { useState, useEffect } from "react"
import axiosInstance from "../../Interceptors/user"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

function WalletPage() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(true) // Define loading state
  const userId = useSelector((state) => state.userAuth.userid)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await axiosInstance.get(`/WalletInfo/${userId}`)
        if (response.status === 200) {
          setBalance(response.data?.balance || 0)
          setTransactions(response.data?.wallet || [])
        }
      } catch (error) {
        console.error("Error fetching wallet details:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchWalletData()
  }, [])

  const PaymentHandler = (type) => {
    navigate("/RazorpayPaymentWallet", {
      state: { amount, transactionType: type },
    })
  }

  return (
    <div className="h-[80vh] w-full flex flex-col items-center justify-center  bg-gray-100 space-y-6 overflow-hidden">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl text-center">
        <h2 className="text-3xl font-bold text-gray-800">Your Wallet</h2>
        <p className="text-4xl font-semibold text-green-600 mt-3">
          ₹ {balance.toLocaleString("en-IN")}
        </p>
        <div className="mt-4 flex gap-2">
          <input
            type="number"
            className="p-2 border border-gray-300 rounded-lg flex-1 text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition duration-200"
            onClick={() => PaymentHandler("add")}
          >
            Add
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition duration-200"
            onClick={() => PaymentHandler("withdraw")}
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Transaction History
        </h2>
        <div className="overflow-y-auto max-h-60 divide-y divide-gray-200 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 px-2"
            >
              <div className="flex flex-col items-start text-gray-700 text-lg">
                <span className="font-semibold">
                  {new Date(transaction.create_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(transaction.create_at).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
              <span
                className={
                  transaction.transaction_type === "debit"
                    ? "text-green-500 font-semibold"
                    : "text-red-500 font-semibold"
                }
              >
                ₹ {transaction.description}
              </span>
              <span
                className={
                  transaction.transaction_type === "debit"
                    ? "text-green-500 font-semibold"
                    : "text-red-500 font-semibold"
                }
              >
                ₹ {transaction.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WalletPage
