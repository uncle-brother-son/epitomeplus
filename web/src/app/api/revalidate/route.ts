import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Verify the revalidation secret
    const secret = request.headers.get('x-revalidate-secret');
    
    if (!secret || secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: 'Invalid or missing revalidation secret' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const body = await request.json();
    
    // Sanity webhook payload structure
    // body._type will contain the document type (e.g., 'homePage', 'workType', etc.)
    // body.slug will contain the slug if available
    
    const documentType = body._type;
    const slug = body.slug?.current || body.slug;
    
    console.log('Revalidating:', { documentType, slug });

    // Revalidate based on document type
    switch (documentType) {
      case 'homePage':
        revalidatePath('/');
        break;
        
      case 'workType':
        // Revalidate homepage (latest work)
        revalidatePath('/');
        
        // Revalidate the specific project page
        if (slug && body.category) {
          revalidatePath(`/${body.category}/${slug}`);
        }
        
        // Revalidate the category page
        if (body.category) {
          revalidatePath(`/${body.category}`);
        }
        break;
        
      case 'aboutPage':
        revalidatePath('/about');
        break;
        
      case 'infoPage':
        if (slug) {
          revalidatePath(`/info/${slug}`);
        }
        break;
        
      case 'setNavigation':
      case 'setFooter':
      case 'setSitedata':
        // These global settings affect all pages
        revalidatePath('/', 'layout');
        break;
        
      default:
        // For unknown types, revalidate everything
        revalidatePath('/', 'layout');
    }

    return NextResponse.json({
      revalidated: true,
      documentType,
      slug,
      now: Date.now(),
    });
    
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { 
        message: 'Error revalidating',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
