import Link from "next/link";

export type TagOption = { label: string; value: string };

export default function TagFilter({
  tags,
  active,
  basePath,
}: {
  tags: ReadonlyArray<TagOption>;
  active: string;
  basePath: string;
}) {
  return (
    <div className="-mx-4 px-4 md:mx-0 md:px-0 flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-2">
      {tags.map((t) => {
        const href = t.value ? `${basePath}?tag=${t.value}` : basePath;
        const isActive = (active || "") === t.value;
        return (
          <Link
            key={t.value || "all"}
            href={href}
            className={`shrink-0 inline-flex items-center font-paperlogy font-medium text-sm md:text-base rounded-full px-5 py-2 transition-colors ${
              isActive
                ? "bg-black text-[#FBF8F1]"
                : "bg-white text-black border-2 border-black hover:bg-black/5"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
