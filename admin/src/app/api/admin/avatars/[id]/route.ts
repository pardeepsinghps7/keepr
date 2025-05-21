import { NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/supabaseClient';

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const itemId = params.id;

    const { error } = await supabaseClient
        .from('avatars')
        .delete()
        .eq('id', itemId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}