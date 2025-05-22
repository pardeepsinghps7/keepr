import { NextResponse } from 'next/server';
import {supabaseClient} from "@/lib/supabaseClient";

export async function GET() {

    const {
        data: { user },
    } = await supabaseClient.auth.getUser();

    if (user?.app_metadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Welcome, Admin!' });
}
