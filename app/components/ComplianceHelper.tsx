"use client"

import { useState } from "react"
import InputForm from "./InputForm"
import ResultsDisplay from "./ResultsDisplay"

// Import the JSON data
import complianceData from "../data/complianceData.json"

export interface MNO {
  mno: string
  status: string
  country: string
  isRegistrationCountry?: boolean
  [key: string]: string | null | boolean | undefined
}

export interface Country {
  name: string
  mnos: MNO[]
  notes?: string
}

const businessLines = ["Unregulated", "Betting", "Crypto", "Int Remit", "PSP", "Forex", "Lending"]

export default function ComplianceHelper() {
  const [results, setResults] = useState<MNO[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [showOnlyRegisteredCountry, setShowOnlyRegisteredCountry] = useState(false)
  const [excludeLI, setExcludeLI] = useState(false)

  const handleSubmit = async (
    country: string,
    businessLine: string,
    onlyRegisteredCountry: boolean,
    excludeLI: boolean,
  ) => {
    setLoading(true)
    setError(null)
    setShowOnlyRegisteredCountry(onlyRegisteredCountry)
    setExcludeLI(excludeLI)
    try {
      // Convert business line to lowercase without spaces to match JSON keys
      const businessLineKey = businessLine.toLowerCase().replace(/\s+/g, "")

      const allowedMNOs = complianceData.countries.flatMap((countryData) => {
        // If only showing registered country and this isn't it, skip
        if (onlyRegisteredCountry && countryData.name !== country) {
          return []
        }
        return countryData.mnos
          .filter((mno) => {
            // Get the status for the specific business line
            const businessLineStatus = mno[businessLineKey] as string

            // Include MNOs that have a status for this business line
            // and are marked as LIVE (with any designation - SS, TP, LI)
            const isLive = businessLineStatus && businessLineStatus.toUpperCase().includes("LIVE")

            // Check if it's an LI MNO
            const isLI = businessLineStatus && businessLineStatus.toUpperCase().includes(" LI")

            // If excluding LI and this is an LI MNO, only include if it's the registration country
            if (excludeLI && isLI && countryData.name !== country) {
              return false
            }

            return isLive
          })
          .map((mno) => ({
            ...mno,
            country: countryData.name,
            // Expand short codes for status and the specific business line
            status: expandShortCodes(mno.status),
            [businessLineKey]: expandShortCodes(mno[businessLineKey] as string),
            // Add a flag to highlight if this is from the registration country
            isRegistrationCountry: countryData.name === country,
          }))
      })

      // Sort MNOs to show registration country first
      const sortedMNOs = allowedMNOs.sort((a, b) => {
        if (a.isRegistrationCountry && !b.isRegistrationCountry) return -1
        if (!a.isRegistrationCountry && b.isRegistrationCountry) return 1
        return a.country.localeCompare(b.country)
      })

      setResults(sortedMNOs)
      setSelectedCountry(complianceData.countries.find((c) => c.name === country) || null)
    } catch (err) {
      setError("An error occurred while fetching data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const expandShortCodes = (status: string): string => {
    if (!status) return ""
    return status
      .replace(/\bSS\b/g, "All Merchants")
      .replace(/\bTP\b/g, "Tech Partner")
      .replace(/\bLI\b/g, "Locally Incorporated")
      .replace(/\bBW\b/g, "Betting Wallet")
      .replace(/\bMNO DD\b/g, "MNO Due Diligence")
      .replace(/\bNULL - TL\b/g, "Trading License Required")
      .replace(/\bNULL - AD\b/g, "Authorized Dealer License Required")
      .replace(/\bNULL - DL\b/g, "Dealer License Required")
      .replace(/\bLIVE - SS\b/g, "LIVE - All Merchants")
      .replace(/\bLIVE - TP\b/g, "LIVE - Tech Partner")
      .replace(/\bLIVE - LI\b/g, "LIVE - Locally Incorporated")
      .replace(/\bLIVE - BW\b/g, "LIVE - Betting Wallet")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Compliance Helper</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <InputForm
            onSubmit={handleSubmit}
            countries={complianceData.countries.map((c) => c.name)}
            businessLines={businessLines}
          />
          {loading && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
              <p>{error}</p>
            </div>
          )}
          {results && (
            <ResultsDisplay
              mnos={results}
              country={selectedCountry}
              tagDefinitions={complianceData.tagDefinitions}
              showOnlyRegisteredCountry={showOnlyRegisteredCountry}
              excludeLI={excludeLI}
            />
          )}
        </div>
      </main>
    </div>
  )
}

