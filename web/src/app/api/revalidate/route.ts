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
    
    const documentType = body._type;
    const slug = body.slug?.current || body.slug;
    
    console.log('Revalidating:', { documentType, slug });

    // The primary path to warm after revalidation
    let warmPath: string | null = null;

    // Revalidate based on document type
    switch (documentType) {
      case 'homePage':
        revalidatePath('/');
        warmPath = '/';
        break;
        
      case 'workType':
        revalidatePath('/');
        
        if (slug && body.category) {
          revalidatePath(`/${body.category}/${slug}`);
          warmPath = `/${body.category}/${slug}`;
        }
        
        if (body.category) {
          revalidatePath(`/${body.category}`);
        }

        // Warm homepage and category page too
        {
          const baseUrl = request.nextUrl.origin;
          fetch(`${baseUrl}/`, {
            headers: { 'User-Agent': 'Sanity-Webhook-Cache-Warmer' },
            cache: 'no-store',
          }).catch(err => console.error('Homepage cache warming failed:', err));
          if (body.category) {
            fetch(`${baseUrl}/${body.category}`, {
              headers: { 'User-Agent': 'Sanity-Webhook-Cache-Warmer' },
              cache: 'no-store',
            }).catch(err => console.error('Category cache warming failed:', err));
          }
        }
        break;
        
      case 'aboutPage':
        revalidatePath('/about');
        warmPath = '/about';
        break;

      case 'infoPage':
        if (slug) {
          revalidatePath(`/info/${slug}`);
          warmPath = `/info/${slug}`;
        }
        break;
        
      case 'setNavigation':
      case 'setFooter':
      case 'setSitedata':
      case 'setCategoryMetadata':
        revalidatePath('/', 'layout');
        warmPath = '/';
        break;
        
      default:
        revalidatePath('/', 'layout');
        warmPath = '/';
    }

    // Warm the cache for the primary changed page only
    if (warmPath) {
      const baseUrl = request.nextUrl.origin;
      fetch(`${baseUrl}${warmPath}`, {
        headers: { 'User-Agent': 'Sanity-Webhook-Cache-Warmer' },
        cache: 'no-store',
      }).catch(err => console.error('Cache warming failed:', err));
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
