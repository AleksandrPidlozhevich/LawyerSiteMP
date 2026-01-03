import { createClient } from '@supabase/supabase-js'

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials')
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const { count: totalCallbacks, error: countError } = await supabase
      .from('callbacks')
      .select('*', { count: 'exact', head: true })

    if (countError) throw countError

    const { count: pendingCallbacks, error: pendingError } = await supabase
      .from('callbacks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    if (pendingError) throw pendingError

    const now = new Date()

    const { error: insertError } = await supabase
      .from('weekly_stats')
      .insert({
        year: now.getFullYear(),
        week_number: getWeekNumber(now),
        data: {
          total_callbacks: totalCallbacks || 0,
          pending_callbacks: pendingCallbacks || 0,
          timestamp: now.toISOString(),
        },
      })

    if (insertError) throw insertError

    return new Response(JSON.stringify({ success: true, message: 'Stats recorded successfully' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Scheduled function error:', error)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}

export const config = {
  schedule: '0 9 * * 1',
}