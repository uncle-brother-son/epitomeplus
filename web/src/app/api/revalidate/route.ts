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

    // Track which paths were revalidated for cache warming
    const pathsToWarm: string[] = [];

    // Revalidate based on document type
    switch (documentType) {
      case 'homePage':
        revalidatePath('/');
        pathsToWarm.push('/');
        break;
        
      case 'workType':
        // Revalidate homepage (latest work)
        revalidatePath('/');
        pathsToWarm.push('/');
        
        // Revalidate the specific project page
        if (slug && body.category) {
          const projectPath = `/${body.category}/${slug}`;
          revalidatePath(projectPath);
          pathsToWarm.push(projectPath);
        }
        
        // Revalidate the category page
        if (body.category) {
          revalidatePath(`/${body.category}`);
          pathsToWarm.push(`/${body.category}`);
        }
        break;
        
      case 'aboutPage':
        revalidatePath('/about');
        pathsToWarm.push('/about');
        break;
        
      case 'infoPage':
        if (slug) {
          const infoPath = `/info/${slug}`;
          revalidatePath(infoPath);
          pathsToWarm.push(infoPath);
        }
        break;
        
      case 'setNavigation':
      case 'setFooter':
      case 'setSitedata':
        // These global settings affect all pages
        revalidatePath('/', 'layout');
        pathsToWarm.push('/');
        break;
        
      default:
        // For unknown types, revalidate everything
        revalidatePath('/', 'layout');
        pathsToWarm.push('/');
    }

    // Warm the cache by fetching revalidated pages
    const baseUrl = request.nextUrl.origin;
    pathsToWarm.forEach(path => {
      const warmUrl = `${baseUrl}${path}`;
      // Fire and forget - don't wait for the response
      fetch(warmUrl, { 
        headers: { 'User-Agent': 'Sanity-Webhook-Cache-Warmer' },
        cache: 'no-store' 
      }).catch(err => console.error('Cache warming failed:', err));
      console.log('Warming cache for:', warmUrl);
    });

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
