# Smart Agro 

Smart Agro is a web application built with **Next.js** to help farmers manage agricultural data in a simple and modern way.
The project is designed to be multilingual (English / French) and scalable for future IoT integrations.

---

## Tech Stack

* **Next.js 14+** (App Router)
* **TypeScript**
* **Tailwind CSS**
* **React Context** (for global language management)

---

## Project Setup

```bash
npx create-next-app@latest smart-agro \
  --ts --eslint --tailwind --app --src-dir --import-alias "@/*"

cd smart-agro
npm run dev
```

The app runs on:
👉 `http://localhost:3000`

---

## What is already implemented

### 1. Landing page (role selection)

* First page allows the user to choose between:

  * **Administrator**
  * **Farmer**
* Clean UI with background image
* Real project logo (image-based, not SVG)
* Logo fills its container and is fully rounded
* Buttons redirect to the login page with the selected role

---

### 2. Language management (English / French)

* A **language dropdown** on the landing page
* Supported languages:

  * 🇬🇧 English
  * 🇫🇷 Français
* Selected language:

  * Updates all texts instantly
  * Is stored in `localStorage`
  * Persists across page navigation
  * Is synchronized with the URL (`?lang=en` / `?lang=fr`)

---

### 3. Global i18n system (no external library)

* Centralized translations in one file
* Custom hook `useT()` for translations

Example usage:

```ts
const { t } = useT();

<h1>{t("appName")}</h1>
```

* Missing translations show a warning in the console
* Easy to extend for new pages and features

---

### 4. LanguageProvider (global state)

* React Context used to manage the language
* Wrapped around the entire app in `layout.tsx`
* No render loops or React warnings
* Stable with Next.js Fast Refresh

---

### 5. Routing structure (in progress)

* `/` → Landing / role selection
* `/login` → Login page (placeholder for now)
* Role is passed via URL (`?role=admin` or `?role=farmer`)

---

## Folder structure (current)

```
src/
 ├─ app/
 │   ├─ layout.tsx
 │   ├─ page.tsx
 │   └─ login/
 │       └─ page.tsx
 ├─ components/
 │   ├─ RoleSelection/
 │   │   └─ RoleSelection.tsx
 │   └─ i18n/
 │       ├─ LanguageProvider.tsx
 │       ├─ translations.ts
 │       └─ useT.ts
 └─ public/
     └─ images/
         ├─ logo.png
         └─ landing-bg.jpg
```

---

## Next steps

* Build the **Login page UI** (admin / farmer)
* Create **Farmer layout**:

  * Navbar (Dashboard, Terrains, Parcelles, Capteurs, Profil, About)
  * Search bar
  * Footer
* Create **Admin layout**
* Connect to real sensor / IoT data (later phase)

---

## Notes

This project is intentionally built **step by step**, focusing on:

* clean architecture
* readability
* scalability
* real-world practices (not just demo code)

---

