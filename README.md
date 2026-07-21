# TeamHouse V2 MVP

> Plateforme de séjours d'équipe clé-en-main — Brief Wizard + Airtable + Stripe

**Status:** ✅ Phase 2 MVP complet — Prêt pour test & Vercel

---

## 🎯 Qu'est-ce qu'il y a dedans ?

### ✅ Brief Wizard (5 étapes)
Client crée un séjour : entreprise → dates → budget/lieux → prestations → récap.

Validation Zod + chargement dynamique hébergements/activités depuis Airtable.

### ✅ Calcul de prix automatique
```
15 pax | 10 000€ HT partenaire
├─ Commission TH 15%     → 1 500€
├─ Frais service 10%     → 1 176€ (< 30 pax)
├─ Sous-total            → 12 676€
├─ TVA 20%               → 2 535€
└─ **Total TTC : 15 211€** → Acompte 30% : 4 563€
```

### ✅ Intégration Airtable
- Fetch dynamique lieux + activités
- Création séjour avec toutes les données
- Statut "Brief soumis"

### ✅ Paiement Stripe
- Checkout Payment Element (thème TeamHouse)
- Webhook met à jour statut Airtable

---

## 🚀 Démarrage rapide

### 1️⃣ Cloner + installer
```bash
git clone https://github.com/YOUR_USERNAME/teamhouse-v2-mvp.git
cd teamhouse-v2-mvp
npm install
```

### 2️⃣ Variables d'environnement
```bash
cp .env.local.example .env.local
```

Remplir `.env.local` :
```env
AIRTABLE_API_KEY=patXXXXXXXX...
AIRTABLE_BASE_ID=appFWg6elYrhlYYip
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3️⃣ Dev server
```bash
npm run dev
# → http://localhost:3000
```

### 4️⃣ Tester le wizard
- Clique "Nouveau séjour" sur la landing
- Remplis les étapes
- Vois le calcul de prix en temps réel
- Crée le séjour dans Airtable

---

## 🔐 Clés API

### Airtable
1. Va sur [airtable.com/account/tokens](https://airtable.com/account/tokens)
2. Crée un token (ou utilise existant)
3. Scopes requis : `data.records:read` + `data.records:write`
4. Copy-paste dans `.env.local`

### Stripe
1. Va sur [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Clé secrète (`sk_test_...`) → `STRIPE_SECRET_KEY`
3. Clé publique (`pk_test_...`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

---

## 📦 Déployer sur Vercel

### Avec GitHub (1 clic)
1. Push ce repo sur GitHub
2. Va sur [vercel.com/new](https://vercel.com/new)
3. "Import Git Repository" → colle l'URL
4. Renseigne les env vars (voir `.env.local.example`)
5. Deploy! 🚀

### Avec Vercel CLI
```bash
vercel --prod
# Renseigne les vars d'env quand demandé
```

---

## 📋 Vérifier les noms des tables Airtable

Code suppose ces tables existent :
- **`Hebergements`** — champs: Nom, Region, Capacite max, Prix nuit HT, Description, Images
- **`Activites`** — champs: Nom, Type, Prix HT, Description
- **`Sejour`** — créée automatiquement quand on soumet le brief

Si tes tables s'appellent différemment, édite `lib/constants.ts` :
```typescript
export const AIRTABLE_TABLES = {
  HEBERGEMENTS: "Hebergements",  // ← Change ici
  ACTIVITES: "Activites",        // ← Change ici
  SEJOUR: "Sejour",              // ← Change ici
};
```

---

## 📁 Structure du projet

```
teamhouse-app/
├── app/
│   ├── layout.tsx                 # Root layout (header, footer, branding)
│   ├── page.tsx                   # Landing page
│   ├── brief/page.tsx             # Brief Wizard
│   ├── brief/success/page.tsx      # Confirmation après création séjour
│   ├── payment/page.tsx            # Stripe checkout
│   ├── payment/success/page.tsx     # Confirmation paiement
│   └── api/
│       ├── airtable/
│       │   ├── hebergements/route.ts
│       │   ├── activites/route.ts
│       │   └── create-sejour/route.ts
│       ├── stripe/
│       │   └── create-payment-intent/route.ts
│       └── webhooks/
│           └── stripe/route.ts
├── components/
│   ├── BriefWizard/
│   │   ├── BriefWizard.tsx        # Orchestrateur
│   │   ├── Step1Organization.tsx
│   │   ├── Step2Details.tsx
│   │   ├── Step3Budget.tsx
│   │   ├── Step4Services.tsx
│   │   ├── Step5Validation.tsx
│   │   └── Summary.tsx            # Calcul prix en temps réel
│   ├── PaymentCheckout.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/
│   ├── airtable.ts                # Client Airtable REST
│   ├── stripe.ts                  # Client Stripe
│   ├── types.ts                   # TypeScript interfaces
│   ├── constants.ts               # Config métier (15%, 10%, etc)
│   ├── validation.ts              # Schémas Zod
│   └── pricing.ts                 # Moteur calcul de prix
├── public/
│   └── favicon.ico
├── .env.local.example
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## 🎨 Charte visuelle

**Couleurs TeamHouse :**
- **Beige** : `#F0EBE0` (fond)
- **Vert-noir** : `#2B3A3A` (texte principal)
- **Corail** : `#E88060` (accents, CTAs)

**Typo :**
- Serif pour titres (Playfair Display ou équivalent)
- Sans-serif pour corps (Inter ou équivalent)

Tous les composants utilisent Tailwind + config couleurs custom.

---

## 🧪 Tester localement

### Brief Wizard
```bash
npm run dev
# http://localhost:3000 → "Nouveau séjour"
```

### API endpoints
```bash
# Fetch hébergements
curl -X POST http://localhost:3000/api/airtable/hebergements \
  -H "Content-Type: application/json" \
  -d '{"region":"Provence"}'

# Fetch activités
curl -X POST http://localhost:3000/api/airtable/activites

# Créer séjour
curl -X POST http://localhost:3000/api/airtable/create-sejour \
  -H "Content-Type: application/json" \
  -d '{
    "nomEntreprise":"Acme Corp",
    "email":"contact@acme.com",
    "dateDebut":"2024-09-15",
    "dateFin":"2024-09-17",
    "pax":20
  }'
```

---

## ⚠️ Notes d'implémentation

1. **Estimation de prix** : Côté client, purement informative. La vraie tarification reste manuelle (équipe TH remplit les champs financiers dans Airtable).

2. **Webhook Stripe** : Met à jour le statut du séjour en "Acompte payé" après paiement.

3. **Phase 2.5 à venir** :
   - Email Brevo post-brief
   - Espace client (suivi séjour)
   - Yousign pour e-signature devis
   - PWA manifest

4. **Sécurité** :
   - Clés Stripe secrètes en backend uniquement
   - Tokens Airtable en backend uniquement
   - Webhooks Stripe vérifiés (signature)

---

## 🐛 Troubleshoot

| Problème | Solution |
|----------|----------|
| "Table not found" (Airtable) | Vérifie noms tables dans `lib/constants.ts` |
| Stripe checkout ne charge pas | Vérifie `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (doit commencer par `pk_`) |
| Airtable API 403 | Vérifie token scopes + base ID + table names |
| CORS error | Check que les API routes sont en `/app/api/` |

---

## 📚 Ressources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Airtable API](https://airtable.com/api)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Vercel Deployment](https://vercel.com/docs)

---

## 🤝 Contributing

Phase 3 incoming : Dashboard partenaire + Admin kanban.

Questions ? Contacte Benjamin ou regarde les commentaires dans le code.

---

**Made with ❤️ for TeamHouse**
