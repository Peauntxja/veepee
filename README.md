# Veepee — Réplique locale

Réplique frontend locale du site [Veepee](https://www.veepee.fr/), avec données mockées et sans backend.

## Prérequis

- Node.js 18.18+（推荐使用 24；仓库已提供 `.nvmrc` / `.node-version`）
- npm

## Installation

```bash
npm install
```

## Lancer en local

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) — redirection automatique vers `/gr/home`.

### 如果你看到 `Unexpected token '??='`

说明你正在用 **Node 14**（或过低版本）启动 Next.js 16。请先切到 Node 24 再启动：

```bash
eval "$(fnm env)"
fnm use 24.13.0
npm run dev
```

## Compte démo

| Email | Mot de passe |
|-------|--------------|
| `demo@veepee.fr` | `demo123` |

Vous pouvez aussi créer un compte via `/gr/registration`.

## Pages MVP

| Route | Description |
|-------|-------------|
| `/gr/home` | Accueil — ventes du jour, mur invité (10 % visible) |
| `/gr/authentication` | Connexion |
| `/gr/registration` | Inscription |
| `/gr/h/maison` | Hub Maison |
| `/gr/p/maison/mobilier-123` | PLP avec filtres et pagination |
| `/gr/p/maison/[slug]/[id]` | Fiche produit |
| `/gr/cart` | Panier multi-marques |

## Parcours de test

1. Visiter `/gr/home` en invité → seules ~10 % des ventes sont visibles
2. Se connecter avec le compte démo → toutes les ventes apparaissent
3. Aller sur `/gr/h/maison` → Hub avec ventes et produits
4. Ouvrir `/gr/p/maison/mobilier-123` → filtrer, paginer
5. Cliquer un produit → PDP → **Ajouter au panier**
6. Vérifier `/gr/cart` → quantités, suppression, commande simulée

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Zustand (auth + panier, persistance localStorage)

## Scripts

```bash
npm run dev      # serveur de développement
npm run build    # build production
npm run start    # serveur production
npm run lint     # ESLint
```

## Remote GitHub

```bash
git remote -v
# origin  https://github.com/Peauntxja/veepee.git
```
