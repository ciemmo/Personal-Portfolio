import Education from "@/components/sections/Education";
import { metadata as educationMetadata } from "@/data/educationMetadata";

export const metadata = educationMetadata;

export default function EducationPage() {
  return (
    <section>
      <Education />
    </section>
  );
}