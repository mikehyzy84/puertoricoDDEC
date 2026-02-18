import RadicarButtons from "@/components/dashboard/RadicarButtons";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-[#1B4332]">Mi Bandeja</h1>
        <RadicarButtons />
      </div>
    </main>
  );
}
