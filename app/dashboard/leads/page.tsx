
"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Trash2, Download, ChevronDown } from "lucide-react"

type Lead = {
  whalesync_postgres_id: string
  date_and_time: string | null
  stage: string | null
  name: string | null
  mobile: string | null
  email: string | null
  services: string | null
  city: string | null
  source: string | null
  assigned_to: string | null
}

export default function LeadsPage() {
  const [data, setData] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)

  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedStage, setSelectedStage] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")

  const [serviceOptions, setServiceOptions] = useState<string[]>([])
  const [stageOptions, setStageOptions] = useState<string[]>([])

  const [editingRow, setEditingRow] = useState<Lead | null>(null)
  const [formState, setFormState] = useState<Partial<Lead>>({})

  // Fetch distinct dropdown values
  const fetchDistincts = async () => {
    const { data: svcData } = await supabase
      .from("Leads")
      .select("services")
      .neq("services", null)

    if (svcData) {
      const uniq = Array.from(new Set(svcData.map((r) => r.services as string)))
      setServiceOptions(uniq.filter(Boolean))
    }

    const { data: stgData } = await supabase
      .from("Leads")
      .select("stage")
      .neq("stage", null)

    if (stgData) {
      const uniq = Array.from(new Set(stgData.map((r) => r.stage as string)))
      setStageOptions(uniq.filter(Boolean))
    }
  }

  // Fetch leads with filters
  const fetchLeads = async () => {
    setLoading(true)

    let query = supabase
      .from("Leads")
      .select(`
        whalesync_postgres_id,
        date_and_time,
        stage,
        name,
        mobile,
        email,
        services,
        city,
        source,
        assigned_to
      `)

    if (selectedService) query = query.eq("services", selectedService)
    if (selectedStage) query = query.eq("stage", selectedStage)
    if (selectedDate) query = query.ilike("date_and_time", `${selectedDate}%`)

    const { data: leads, error } = await query
    if (!error) setData(leads || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchDistincts()
    fetchLeads()
  }, [])

  useEffect(() => {
    fetchLeads()
  }, [selectedService, selectedStage, selectedDate])

  const columns = useMemo<ColumnDef<Lead>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "date_and_time",
      header: "Date",
      cell: ({ row }) => {
        const v = row.getValue("date_and_time")
        return v ? new Date(v).toLocaleString() : "-"
      },
    },
    {
      accessorKey: "stage",
      header: "Stage",
      cell: ({ row }) => row.getValue("stage") || "-",
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.getValue("name") || "-",
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
      cell: ({ row }) => row.getValue("mobile") || "-",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.getValue("email") || "-",
    },
    {
      accessorKey: "services",
      header: "Services",
      cell: ({ row }) => row.getValue("services") || "-",
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => row.getValue("city") || "-",
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => row.getValue("source") || "-",
    },
    {
      accessorKey: "assigned_to",
      header: "Assigned To",
      cell: ({ row }) => row.getValue("assigned_to") || "-",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const lead = row.original
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditingRow(lead)
                setFormState(lead)
              }}
            >
              <Edit size={16} />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                const { error } = await supabase
                  .from("Leads")
                  .delete()
                  .eq("whalesync_postgres_id", lead.whalesync_postgres_id)
                if (!error) fetchLeads()
              }}
            >
              <Trash2 size={16} />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )
      },
    },
  ], [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const toSave = { ...formState }
    if (editingRow) {
      await supabase
        .from("Leads")
        .update(toSave)
        .eq("whalesync_postgres_id", editingRow.whalesync_postgres_id)
    } else {
      await supabase.from("Leads").insert([toSave])
    }
    setEditingRow(null)
    setFormState({})
    fetchLeads()
  }

  const exportCSV = () => {
    const headers = [
      "date_and_time",
      "stage",
      "name",
      "mobile",
      "email",
      "services",
      "city",
      "source",
      "assigned_to",
    ]
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((h) => {
            const v = (row as any)[h]
            return typeof v === "string"
              ? `"${v.replace(/"/g, '""')}"`
              : v ?? ""
          })
          .join(",")
      ),
    ]
    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "leads_export.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Leads</h1>

      {/* Top row: Search left, Buttons right */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Search */}
        <Input
          placeholder="Search using Name, Phone or City"
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="w-[800px]"
        />

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="default" onClick={() => setEditingRow(null)}>
            + Add New Lead
          </Button>
          <Button variant="outline" onClick={exportCSV}>
            <Download size={16} className="inline-block mr-1" />
            Export Leads
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-4 flex-wrap mt-4">
        {/* Service Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedService || "All Services"} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Service</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSelectedService("")}>
              All Services
            </DropdownMenuItem>
            {serviceOptions.map((svc) => (
              <DropdownMenuItem key={svc} onClick={() => setSelectedService(svc)}>
                {svc}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Stage Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedStage || "All Stages"} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Stage</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSelectedStage("")}>
              All Stages
            </DropdownMenuItem>
            {stageOptions.map((st) => (
              <DropdownMenuItem key={st} onClick={() => setSelectedStage(st)}>
                {st}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Filter */}
        <div>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setSelectedService("")
            setSelectedStage("")
            setSelectedDate("")
          }}
        >
          Clear Filters
        </Button>
      </div>

      {/* Lead Form */}
      <div className="border rounded-md p-4">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block">Name</label>
            <Input
              value={formState.name || ""}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block">Email</label>
            <Input
              value={formState.email || ""}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block">Mobile</label>
            <Input
              value={formState.mobile || ""}
              onChange={(e) => setFormState({ ...formState, mobile: e.target.value })}
            />
          </div>
          <div>
            <label className="block">Stage</label>
            <Input
              value={formState.stage || ""}
              onChange={(e) => setFormState({ ...formState, stage: e.target.value })}
            />
          </div>
          <div>
            <label className="block">Services</label>
            <Input
              value={formState.services || ""}
              onChange={(e) => setFormState({ ...formState, services: e.target.value })}
            />
          </div>
          <div>
            <label className="block">City</label>
            <Input
              value={formState.city || ""}
              onChange={(e) => setFormState({ ...formState, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block">Source</label>
            <Input
              value={formState.source || ""}
              onChange={(e) => setFormState({ ...formState, source: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 flex space-x-2">
            <Button type="submit">
              {editingRow ? "Update Lead" : "Create Lead"}
            </Button>
            {editingRow && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingRow(null)
                  setFormState({})
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Leads Table */}
      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-4">
                  No leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
