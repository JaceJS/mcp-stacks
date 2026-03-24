import { CreateStackForm } from "@/features/stacks/components/CreateStackForm";
import {
  getServersForPicker,
  getTagsForPicker,
} from "@/features/stacks/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Your Stack",
};

export default async function NewStackPage() {
  const [servers, tags] = await Promise.all([
    getServersForPicker(),
    getTagsForPicker(),
  ]);

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Share your stack
          </h1>
          <p className="text-[14px] text-foreground-muted">
            Combine your favorite MCP servers into a stack and share it with the
            community.
          </p>
        </div>
        <CreateStackForm servers={servers} tags={tags} />
      </div>
    </div>
  );
}
