import Link from "next/link";

export default function NotFound() {
  return (

    <main id="main-content">
      <div className="grid10_ gap-y-3 mb-10 md:mb-20">
        <div className="col-start-1 col-span-3 md:col-start-2 md:col-span-8 text-center flex flex-col gap-4 items-center justify-center">
            <h1 className="text-xl">404 - Page Not Found</h1>
            <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
            <Link href="/" prefetch={false}>Go Back Home</Link>
        </div>
      </div>
    </main>
  );
}
