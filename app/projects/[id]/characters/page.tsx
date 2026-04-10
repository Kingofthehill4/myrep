import { ProjectCharactersClient } from "@/components/ProjectCharactersClient";

export default async function ProjectCharactersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectCharactersClient projectId={id} />;
}
