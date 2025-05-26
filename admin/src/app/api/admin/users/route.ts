// app/api/admin/users/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
    /*const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
        app_metadata: { role: "admin" }
    });*/
    const { data, error } = await supabaseAdmin.auth.admin.listUsers()
    const formattedUsers = data.users
        .filter((user) => user.app_metadata?.role !== 'admin')
        .map((user) => ({
            id: user.id,
            email: user.email,
            email_confirmed: user.email_confirmed_at ? 'Yes' : 'No',
            created_at: new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(new Date(user.created_at)),
            last_sign_in_at: user.last_sign_in_at ? new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(new Date(user.last_sign_in_at)) : '',
        }))
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(formattedUsers)
}