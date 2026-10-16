import Certifications from "@/components/sections/Certifications";
import { metadata as certificationsMetadata } from "@/data/certificationsMetadata";

export const metadata = certificationsMetadata;

export default function CertificationsPage() {
  return (
    <section>
      <Certifications />
    </section>
  );
}