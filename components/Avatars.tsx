import { initials } from "@/lib/format";
import { getPerson } from "@/lib/people";

export function Avatar({
  id,
  size = 32,
  speaking = false,
}: {
  id: string;
  size?: number;
  speaking?: boolean;
}) {
  const person = getPerson(id);
  return (
    <span
      className="relative grid place-items-center rounded-full text-[11px] font-semibold text-[#07080b]"
      style={{
        width: size,
        height: size,
        background: person.color,
        boxShadow: speaking ? `0 0 0 2px #07080b, 0 0 0 4px ${person.color}` : undefined,
      }}
      title={person.name}
    >
      {initials(person.name)}
    </span>
  );
}

export function AvatarStack({ ids, limit = 5 }: { ids: string[]; limit?: number }) {
  const shown = ids.slice(0, limit);
  const extra = ids.length - shown.length;
  return (
    <span className="flex items-center">
      {shown.map((id, index) => (
        <span key={id} className="-ml-1.5 first:ml-0" style={{ zIndex: shown.length - index }}>
          <Avatar id={id} size={26} />
        </span>
      ))}
      {extra > 0 && (
        <span className="-ml-1.5 grid h-[26px] w-[26px] place-items-center rounded-full bg-[#181f2a] text-[10px] text-[#8b97a8]">
          +{extra}
        </span>
      )}
    </span>
  );
}
