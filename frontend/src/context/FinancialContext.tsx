'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

interface FinancialContextType {
  userData: any
  accounts: any[]
  transactions: any[]
  loading: boolean
  error: string | null
  refreshData: () => void
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<any>(null)
  const [accounts, setAccounts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock user ID - replace with actual user ID from your auth system
  const userId = 'fb919047-167b-4b33-9cfc-ab963c780166'

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log('Fetching user data for ID:', userId)
      
      const [userData, accountsData, transactionsData] = await Promise.all([
        api.getUser(userId),
        api.getUserAccounts(userId),
        api.getUserTransactions(userId)
      ])

      console.log('Received user data:', userData)
      
      if (!userData) {
        throw new Error('No user data received from the server')
      }

      setUserData(userData)
      setAccounts(accountsData)
      setTransactions(transactionsData)
      setError(null)
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message
      console.error('Error fetching financial data:', errorMessage)
      setError(errorMessage)
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [userId])

  const value = {
    userData,
    accounts,
    transactions,
    loading,
    error,
    refreshData: () => {
      setLoading(true)
      fetchData()
    }
  }

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  )
}

export function useFinancial() {
  const context = useContext(FinancialContext)
  if (context === undefined) {
    throw new Error('useFinancial must be used within a FinancialProvider')
  }
  return context
} 