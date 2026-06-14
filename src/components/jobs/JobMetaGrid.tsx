interface MetaField {
  label: string;
  value: string;
}

interface JobMetaGridProps {
  items: MetaField[];
}

export function JobMetaGrid({ items }: JobMetaGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="text-[10px] uppercase tracking-wider text-muted/50 mb-0.5">
            {item.label}
          </div>
          <div className="text-sm font-medium">{item.value || '--'}</div>
        </div>
      ))}
    </div>
  );
}
