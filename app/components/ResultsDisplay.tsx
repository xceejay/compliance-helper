import type { MNO, Country } from "./ComplianceHelper"

interface ResultsDisplayProps {
  mnos: MNO[]
  country: Country | null
  tagDefinitions: Record<string, string>
  showOnlyRegisteredCountry: boolean
  excludeLI: boolean
  showMinimalInfo: boolean
}

export default function ResultsDisplay({
  mnos,
  country,
  tagDefinitions,
  showOnlyRegisteredCountry,
  excludeLI,
  showMinimalInfo,
}: ResultsDisplayProps) {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Available MNOs</h2>
      {country?.notes && !showMinimalInfo && (
        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="font-bold">Important Note for {country.name}:</p>
          <p>{country.notes}</p>
        </div>
      )}
      {mnos.length === 0 ? (
        <p>No MNOs found supporting this business line.</p>
      ) : (
        <>
          {!showMinimalInfo && (
            <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
              <p className="font-bold">Results Guide:</p>
              <p>
                {showOnlyRegisteredCountry
                  ? `Showing MNOs that support your business line in ${country?.name}.`
                  : "Showing all MNOs that support your business line. MNOs from your registration country are listed first."}
                {excludeLI && " Excluding LI MNOs except for the registration country."}
                {" Pay special attention to any local incorporation requirements or restrictions."}
              </p>
            </div>
          )}
          <ul className="space-y-4">
            {mnos.map((mno, index) => (
              <li
                key={index}
                className={`border-b pb-4 ${
                  mno.isRegistrationCountry ? "bg-green-50 p-4 rounded-lg border border-green-200" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg">
                    {mno.mno} ({mno.country})
                    {mno.isRegistrationCountry && (
                      <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
                        Registration Country
                      </span>
                    )}
                  </h3>
                </div>
                {!showMinimalInfo && (
                  <>
                    <p className="mt-2">
                      Status: <span className="font-semibold">{mno.status}</span>
                    </p>
                    {Object.entries(mno).map(([key, value]) => {
                      if (
                        key !== "mno" &&
                        key !== "status" &&
                        key !== "country" &&
                        key !== "goLiveETA" &&
                        key !== "comments" &&
                        key !== "isRegistrationCountry" &&
                        value &&
                        value !== "null"
                      ) {
                        return (
                          <p key={key} className="capitalize mt-1">
                            {key.replace(/([A-Z])/g, " $1").trim()}: <span className="font-semibold">{value}</span>
                          </p>
                        )
                      }
                      return null
                    })}
                    {mno.comments && (
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold">Comments:</span> {mno.comments}
                      </p>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

