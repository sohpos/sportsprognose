'use client';

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <div className="p-10 text-center text-red-500">
      <h1 className="text-2xl font-bold mb-4">Ein Fehler ist aufgetreten</h1>
      <p>{error.message}</p>
    </div>
  );
}
