import {
  Info,
  InfoRow,
  List,
  ListItem,
  PageTitle,
  Prose,
  Section,
} from "@/components/primitives";
import type { SitePage, SiteSection } from "@/lib/content-types";

/** Blank line separates paragraphs, mirroring how the admin textarea behaves. */
export function paragraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function SectionBlock({ section }: { section: SiteSection }) {
  const body = (() => {
    if (section.kind === "list") {
      return (
        <List>
          {section.items.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              meta={item.meta ?? undefined}
              aside={item.aside ?? undefined}
              href={item.href ?? undefined}
            />
          ))}
        </List>
      );
    }
    if (section.kind === "info") {
      return (
        <Info>
          {section.items.map((item) => (
            <InfoRow key={item.id} label={item.title}>
              {item.href ? (
                <a href={item.href}>{item.aside ?? item.meta ?? item.href}</a>
              ) : (
                (item.aside ?? item.meta ?? "")
              )}
            </InfoRow>
          ))}
        </Info>
      );
    }
    return (
      <Prose>
        {paragraphs(section.body ?? "").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </Prose>
    );
  })();

  const content = (
    <Section label={section.label ?? undefined}>{body}</Section>
  );

  return section.anchor ? <section id={section.anchor}>{content}</section> : content;
}

export function PageBody({
  page,
  children,
}: {
  page: SitePage;
  children?: React.ReactNode;
}) {
  return (
    <>
      <PageTitle title={page.title} subtitle={page.subtitle ?? undefined} />
      {page.intro ? (
        <Prose>
          {paragraphs(page.intro).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Prose>
      ) : null}
      {children}
      {page.sections.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}
    </>
  );
}
