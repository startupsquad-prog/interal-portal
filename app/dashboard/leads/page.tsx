// import React from 'react'
// import { DataTable } from '@/components/data-table'
// const page = () => {
//   return (
//     <div>
//       <DataTable/>
//     </div>
//   )
// }

// export default page
"use client"

import { DataTable } from "@/components/data-table" // adjust path
import { ColumnDef } from "@tanstack/react-table"

// 1. Define columns
type Lead = {
  id: string
  name: string
  email: string
}

const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
]

// 2. Dummy data for now
const data: Lead[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
]

const page = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
export default page;