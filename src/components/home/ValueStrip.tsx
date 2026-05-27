export function ValueStrip() {
  const items = [
    {
      title: "Plutôt du soir ou du matin ?",
      description: "Tous les jours, de nouvelles ventes à 7 h et à 19 h.",
    },
    {
      title: "On s'habitue vite aux prix doux",
      description:
        "Chez Veepee, les plus grandes marques affichent jusqu'à -70% toute l'année.",
    },
    {
      title: "Les surprises, c'est notre quotidien",
      description:
        "Et la toute première vous attend après votre inscription chez nous.",
    },
  ];

  return (
    <section className="border-y border-veepee-border bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.title}>
            <h3 className="text-base font-bold">{item.title}</h3>
            <p className="mt-2 text-sm text-veepee-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
