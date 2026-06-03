interface AdminWriteArgs {
  table: string
  inserts?: Record<string, unknown>[]
  updates?: { id: string; [k: string]: unknown }[]
  deletes?: string[]
}

export async function adminWrite(args: AdminWriteArgs): Promise<boolean> {
  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  })
  return res.ok
}
