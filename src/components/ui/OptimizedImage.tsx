import Image from "next/image";

// Default blur data URL - 1x1px transparent PNG
const DEFAULT_BLUR_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  blurDataURL?: string;
  placeholder?: "blur" | "empty" | "data:image/...";
  width: number;
  height: number;
  sizes?: string;
  quality?: number;
  loading?: "eager" | "lazy";
  onLoad?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  style?: React.CSSProperties;
  unoptimized?: boolean;
}

export default function OptimizedImage({
  className,
  priority,
  blurDataURL,
  placeholder,
  width,
  height,
  ...props
}: OptimizedImageProps) {
  // Use blurDataURL if provided, otherwise use default for images that should blur
  const shouldBlur = blurDataURL !== undefined || placeholder === "blur";
  const finalBlurDataURL = blurDataURL || (shouldBlur ? DEFAULT_BLUR_DATA_URL : undefined);
  const finalPlaceholder = shouldBlur ? "blur" : placeholder ?? "empty";

  return (
    <Image
      {...props}
      className={className}
      priority={priority ?? false}
      width={width}
      height={height}
      placeholder={finalPlaceholder}
      blurDataURL={finalBlurDataURL}
    />
  );
}