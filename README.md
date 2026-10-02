# Rasoi Bharat — Shahi Rasoi Master Edition

This build keeps the uploaded Shahi Rasoi visual theme and expands the canonical menu with the recipe names supplied in the latest upload.

## Recipe data
- The final canonical menu contains 164 recipes after merging the previous 135-recipes build with the 75 named dishes from the latest upload and removing exact/obvious duplicates.
- The latest uploaded list contains 100,000 lines; the first 75 are recognizable named dishes, while later entries are mechanically generated combinations such as “Punjabi Curry Potato”. This build imports the 75 canonical named dishes instead of fabricating ingredient lists for the generated combinations.
- Duplicate canonical dishes replace obvious older variants (for example, standard “Dal Makhani” replaces the previous descriptive variant).
- Ingredient lists are normalized to practical four-serving amounts and phrased as a traditional/common version where regional recipes vary.

## Images
New dishes use dish-specific Wikimedia Commons image lookup at runtime, based on the recipe name and region, with localStorage caching. Existing Shahi Rasoi images remain unchanged. A generic fallback image is used only if a Commons lookup cannot be completed.

## Included
- Saffron / royal-gold / emerald / crimson visual system
- Playfair-style culinary headings and glass panels
- Regional cuisine matrix
- Recipe search and multi-filter controls
- Smart Masala Dabba, meal planner, spice science and saved/custom recipe areas
- PWA manifest, service worker, icons and privacy page

For Microsoft Store packaging, test the hosted HTTPS/PWA build and package it with a supported Windows PWA workflow such as PWABuilder.
