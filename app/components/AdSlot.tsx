type AdSlotProps = {
  label?: string;
};

export default function AdSlot({ label = "Advertisement" }: AdSlotProps) {
  return (
    <div className="my-8 rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/60 p-6 text-center">
      <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
        {label}
      </p>

      <div className="min-h-[120px] flex items-center justify-center text-zinc-500">
        Ad space
      </div>
    </div>
  );
}
