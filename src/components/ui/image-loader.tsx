
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
      className={cn("relative overflow-hidden", className)}
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
              "transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
              "w-full h-full object-cover"
            )}
            decoding="async"
          />
        </picture>
      )}
    </div>
  );
};

export default ImageLoader;
