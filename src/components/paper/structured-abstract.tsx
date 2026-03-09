import { parseAbstract } from "@/lib/utils/parse-abstract";

export function StructuredAbstract({ text }: { text: string }) {
  const sections = parseAbstract(text);

  // Unstructured abstract — render as plain text
  if (sections.length === 1 && !sections[0].label) {
    return (
      <p className="whitespace-pre-line text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
        {sections[0].text}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => (
        <div key={idx}>
          {section.label && (
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {section.label}
            </h3>
          )}
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
            {section.text}
          </p>
        </div>
      ))}
    </div>
  );
}
