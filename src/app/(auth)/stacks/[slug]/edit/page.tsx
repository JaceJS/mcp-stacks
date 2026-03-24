import { notFound } from "next/navigation";
import {
  getStackForEdit,
  getServersForPicker,
  getTagsForPicker,
} from "@/features/stacks/queries";
import { CreateStackForm } from "@/features/stacks/components/CreateStackForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Stack",
};

export default async function EditStackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [stack, allServers, allTags] = await Promise.all([
    getStackForEdit(slug),
    getServersForPicker(),
    getTagsForPicker(),
  ]);

  if (!stack) notFound();

  const initialServers = allServers.filter((s) =>
    stack.serverIds.includes(s.id),
  );

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
            Edit stack
          </h1>
          <p className="text-[14px] text-foreground-muted">
            Update your stack configuration.
          </p>
        </div>
        <CreateStackForm
          servers={allServers}
          tags={allTags}
          mode="edit"
          stackId={stack.id}
          initialTitle={stack.title}
          initialDescription={stack.description ?? ""}
          initialServers={initialServers}
          initialTagIds={stack.tagIds}
          initialConfigJson={stack.config_json}
        />
      </div>
    </div>
  );
}
