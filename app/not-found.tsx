import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16">
      <h1 className="font-serif text-[34px]">Nothing at this depth.</h1>
      <Link href="/" className="mt-4 inline-block text-[14px] text-graphite hover:text-paper">
        Back to the library
      </Link>
    </div>
  );
}
