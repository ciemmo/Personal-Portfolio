import Image from "next/image";

interface OptimizedImageProps extends React.ComponentProps<typeof Image> {
  className?: string;
  priority?: boolean;
  blurPlaceholder?: boolean;
}

export default function OptimizedImage({
  className,
  priority,
  blurPlaceholder,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      {...props}
      className={className}
      priority={priority ?? false}
      // Only add blurPlaceholder if it's explicitly set to true
      // and we have a blur data URL (would normally come from a placeholder)
      // For simplicity, we're not implementing actual blur placeholder here
      // but keeping the prop for compatibility
      // Note: Next.js Image component doesn't have a direct blurPlaceholder prop
      // This would typically be handled by providing a blurDataURL
    />
  );
}