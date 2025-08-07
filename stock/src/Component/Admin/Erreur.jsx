export default function Erreur() {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">Erreur 404</h1>
        <p className="mt-4 text-gray-700">La page que vous cherchez n'existe pas.</p>
      </div>
    </div>
  );
}