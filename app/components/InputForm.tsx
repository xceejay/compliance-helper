"use client"

import type React from "react"

import { useState } from "react"

interface InputFormProps {
  onSubmit: (country: string, businessLine: string, onlyRegisteredCountry: boolean, excludeLI: boolean) => void
  countries: string[]
  businessLines: string[]
}

export default function InputForm({ onSubmit, countries, businessLines }: InputFormProps) {
  const [country, setCountry] = useState("")
  const [businessLine, setBusinessLine] = useState("")
  const [onlyRegisteredCountry, setOnlyRegisteredCountry] = useState(false)
  const [excludeLI, setExcludeLI] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(country, businessLine, onlyRegisteredCountry, excludeLI)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
          Registration Country
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select a country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="businessLine">
          Business Line
        </label>
        <select
          id="businessLine"
          value={businessLine}
          onChange={(e) => setBusinessLine(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select a business line</option>
          {businessLines.map((bl) => (
            <option key={bl} value={bl}>
              {bl}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={onlyRegisteredCountry}
            onChange={(e) => setOnlyRegisteredCountry(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Show only MNOs for registered country</span>
        </label>
      </div>
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={excludeLI}
            onChange={(e) => setExcludeLI(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Exclude MNOs that require local incorporation (except for registration country)</span>
        </label>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Get Allowed MNOs
        </button>
      </div>
    </form>
  )
}

