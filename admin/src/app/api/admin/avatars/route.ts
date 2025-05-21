// app/api/admin/users/route.ts
import { NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/supabaseClient';

export async function GET() {
    const { data, error } = await supabaseClient.from('avatars').select()
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }
    const formattedData = data
        .map((item) => ({
            id: item.id,
            avatar: item.url,
            created_at: new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(new Date(item.created_at)),
        }))
    return NextResponse.json(formattedData)
}