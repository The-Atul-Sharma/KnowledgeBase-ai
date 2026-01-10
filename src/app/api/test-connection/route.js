import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('document_chunks')
      .select('count')
      .limit(1);

    if (error) {
      return Response.json(
        { 
          success: false, 
          error: error.message,
          message: 'Connection failed. Make sure you have run the SQL migration in Supabase.'
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: 'Supabase connection successful!',
      hasAdminAccess: !!supabaseAdmin,
    });
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        error: error.message,
        message: 'Failed to connect to Supabase'
      },
      { status: 500 }
    );
  }
}

