import { prisma } from "@/lib/prisma";
import { SceneEditor } from "@/components/SceneEditor";

export default async function NewScenePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const characters = await prisma.character.findMany({ where: { projectId: id }, select: { id: true, name: true } });
  return (
    <div className="grid gap-3">
      <h1 className="text-2xl">Scene Blueprint Editor</h1>
      <SceneEditor projectId={id} characters={characters} onSaved={() => {}} />
    </div>
  );
}
