import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-[28px] font-semibold">Nothing at this depth.</h1>
      <Link href="/" className="mt-4 inline-block text-[#4aa3ff]">
        Back to the library
      </Link>
    </div>
  );
}
