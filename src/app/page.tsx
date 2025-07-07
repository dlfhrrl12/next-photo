export default function Home() {
  const photos = Array.from({ length: 9 });
  return (
    <main className="container mx-auto p-4">
      <h1 className="my-8 text-center text-4xl font-bold">Next.js Photos</h1>
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        {photos.map((_, index) => (
          <div
            key={index}
            className="w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-md"
          >
            <div className="aspect-square w-full bg-gray-300"></div>
            <div className="p-4">
              <p className="text-sm text-gray-700">Photo Caption {index + 1}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
