// app/api/admin/users/route.ts
import { NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/supabaseClient';

export async function GET() {
    const { data, error } = await supabaseClient.rpc('get_movies_with_user')
    //const { data, error } = await supabaseClient.from('movies').select()
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }
    const formattedData = data
        .map((item) => ({
            id: item.id,
            email: item.email,
            title: item.title,
            save_for_later: item.save_for_later,
            status: item.status == 'to_watch' ? 'To Watch' : 'Watched',
            rating: item.rating,
            recommended_by: item.recommended_by,
            notes: item.notes,
            created_at: new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(new Date(item.created_at)),
        }))
    return NextResponse.json(formattedData)
}