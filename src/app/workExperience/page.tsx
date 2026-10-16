import WorkExperience from "@/components/sections/WorkExperience";
import { metadata as workExperienceMetadata } from "@/data/workExperienceMetadata";

export const metadata = workExperienceMetadata;

export default function WorkExperiencePage() {
  return (
    <section>
      <WorkExperience />
    </section>
  );
}