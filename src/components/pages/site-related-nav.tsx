import Link from "next/link";

export type SiteRelatedNavItem = { label: string; path: string };

export function SiteRelatedNavStrip({
  relatedNav,
  slug,
  primaryColor,
  isDark,
  /** When set, links point at the DFY catalog preview route instead of /s/{slug}. */
  catalogPreviewSiteId,
}: {
  relatedNav?: SiteRelatedNavItem[];
  slug: string;
  primaryColor: string;
  isDark: boolean;
  catalogPreviewSiteId?: string;
}) {
  if (!relatedNav?.length) return null;

  const hrefFor = (item: SiteRelatedNavItem) => {
    if (catalogPreviewSiteId) {
      const page = item.path === "" ? "landing" : item.path.replace(/^\//, "");
      return `/preview/dfy/${encodeURIComponent(catalogPreviewSiteId)}?page=${page}`;
    }
    return item.path === "" ? `/s/${slug}` : `/s/${slug}${item.path}`;
  };

  return (
    <section
      className="py-12 px-6 border-t"
      style={{ borderColor: isDark ? "#222" : "#f3f4f6", backgroundColor: isDark ? "#050505" : "#fafafa" }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>
          On this site
        </p>
        <div className="flex flex-wrap gap-2">
          {relatedNav.map((item) => (
            <Link
              key={item.path || "home"}
              href={hrefFor(item)}
              className="px-4 py-2 rounded-xl text-sm font-bold border transition-colors hover:opacity-90"
              style={
                isDark
                  ? { borderColor: "#333", color: "#e5e7eb" }
                  : { borderColor: "#e5e7eb", color: "#111827" }
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
