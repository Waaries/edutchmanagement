
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  webpSrc?: string;
  loading?: "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
  aspectRatio?: string;
  priority?: boolean;
}

const ImageLoader = ({
  src,
  alt,
  className,
  fallbackSrc,
  webpSrc,
  loading = "lazy",
  onLoad,
  onError,
  aspectRatio = "auto",
  priority = false
}: ImageLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === "eager") {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Convert regular image URLs to WebP if webpSrc is not provided
  const getWebPUrl = (originalUrl: string) => {
    if (webpSrc) return webpSrc;
    
    // For Unsplash images, add WebP format parameter
    if (originalUrl.includes('images.unsplash.com')) {
      const url = new URL(originalUrl);
      url.searchParams.set('fm', 'webp');
      url.searchParams.set('q', '85');
      return url.toString();
    }
    
    return originalUrl;
  };

  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;
  const optimizedSrc = getWebPUrl(imageSrc);

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden bg-muted", className)}
      style={{ aspectRatio }}
    >
      {!isLoaded && isIntersecting && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {isIntersecting && (
        <picture>
          <source srcSet={optimizedSrc} type="image/webp" />
          <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            loading={loading}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "transition-opacity duration-300 w-full h-full object-cover",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            decoding="async"
          />
        </picture>
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground text-sm p-4">
          <div className="text-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 mx-auto mb-2 text-muted-foreground/70"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Afbeelding niet beschikbaar
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageLoader;
