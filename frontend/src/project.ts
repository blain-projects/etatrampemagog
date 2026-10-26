/**
 * Identité du projet affichée par le SiteFooter ; version et commit viennent
 * du build (build-meta.ts).
 */
export const project = {
  name: "Rampe de mise à l'eau — Magog",
  tagline: "L'état de la rampe de la capitainerie, d'après les avis de la Ville de Magog.",
  createdAt: '2026-04-07', // date du premier commit
  // TODO(guillaume): licence — à confirmer.
  maintainer: 'Guillaume Blain',
  // TODO(guillaume): contact (adresse publique à afficher).
  hosting: 'Traefik · Docker',
  repoUrl: 'https://github.com/blain-projects/etatrampemagog',
  branch: 'main',
}

/**
 * Mode vitrine (courants + lentille) : app publique, donc vitrine par défaut.
 * VITE_BLAIN_SHOWOFF=true|false (build arg) l'emporte s'il est posé.
 */
export const isShowOff = () => {
  const value = import.meta.env.VITE_BLAIN_SHOWOFF
  return value ? value === 'true' : true
}
