/**
 * Utility to convert an array of JSON objects to a CSV string and trigger browser download
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns: { header: string; key: keyof T; formatter?: (val: any) => string }[]
) {
  if (!data || !data.length) {
    alert("No data to export.")
    return
  }

  // Header row
  const headers = columns.map((col) => `"${col.header}"`).join(",")

  // Data rows
  const rows = data.map((item) =>
    columns
      .map((col) => {
        let val: any = item[col.key]
        if (col.formatter) {
          val = col.formatter(val)
        }
        if (val === null || val === undefined) {
          return '""'
        }
        const stringVal = String(val).replace(/"/g, '""')
        return `"${stringVal}"`
      })
      .join(",")
  )

  const csvContent = "\uFEFF" + [headers, ...rows].join("\r\n") // UTF-8 BOM

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
