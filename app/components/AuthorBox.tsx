import Image from "next/image";
import Link from "next/link";
import { authorProfile } from "@/data/authorProfile";

type AuthorBoxProps = {
  theme?: "dark" | "light";
};

export default function AuthorBox({ theme = "dark" }: AuthorBoxProps) {
  const isLight = theme === "light";

  return (
    <section
      className={[
        "mt-12 rounded-3xl border p-6",
        isLight
          ? "border-zinc-200 bg-white text-zinc-950 shadow-sm"
          : "border-zinc-800 bg-zinc-900 text-white",
      ].join(" ")}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Image
          src={authorProfile.imagePath}
          alt={`${authorProfile.name}, founder of Watch Tennis Today`}
          width={112}
          height={112}
          sizes="112px"
          className="h-24 w-24 rounded-full border border-zinc-700 object-cover sm:h-28 sm:w-28"
        />

        <div>
          <p
            className={[
              "text-sm font-bold uppercase tracking-[0.16em]",
              isLight ? "text-emerald-700" : "text-green-400",
            ].join(" ")}
          >
            Written and reviewed by
          </p>
          <h2 className="mt-2 text-2xl font-black">{authorProfile.name}</h2>
          <p
            className={[
              "mt-2 leading-7",
              isLight ? "text-zinc-700" : "text-zinc-300",
            ].join(" ")}
          >
            {authorProfile.shortBio}
          </p>
          <Link
            href="/authors/watch-tennis-today"
            className={[
              "mt-4 inline-flex rounded-2xl px-5 py-3 text-sm font-black",
              isLight
                ? "bg-zinc-950 text-white hover:bg-zinc-800"
                : "bg-emerald-400 text-black hover:bg-emerald-300",
            ].join(" ")}
          >
            Read Angelika&apos;s profile
          </Link>
        </div>
      </div>
    </section>
  );
}
