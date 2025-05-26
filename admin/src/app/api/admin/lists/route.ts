import { NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/supabaseClient';

export async function GET() {
    const { data, error } = await supabaseClient.from('lists').select(`
    id,
    label,
    icon,
    is_default,
    created_at,
    items(count)
  `).order('created_at', { ascending: false });
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }
    const formattedData = data
        .map((item) => ({
            id: item.id,
            label: item.label,
            icon: item.icon,
            is_default: item.is_default == true ? 'Yes' : 'No',
            items_count: item.items[0].count,
            created_at: new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(new Date(item.created_at)),
        }))
    return NextResponse.json(formattedData)
}