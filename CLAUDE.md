# Capcache

Webapp där man samlar skärmdumpar i ett sökbart bibliotek ("Your screenshot archive").
Appnamnet ska ligga i en enda konstant så att det går att byta senare.

## Stack
- Frontend: Vite + React + TypeScript + Tailwind CSS (i /frontend)
- Backend: .NET 10 Web API med EF Core och Controllers (i /backend)
- Databas: PostgreSQL
- Bildlagring: Cloudflare R2 (S3-kompatibelt)
- Allt ska rymmas inom gratisnivåer

## Design
Designen kommer från Claude Design (handoff-paket, eller exporterad ZIP i /design).
UI på engelska, indigo som accentfärg, bilderna i fokus, dämpat UI.

## Arkitektur

### Frontend: feature-first
- Gruppera kod efter funktion, inte efter teknisk typ
- src/features/<feature>/{components,hooks,api,types.ts}, delat i src/shared
- En feature importerar inte djupt i en annan features filer, bara via dess index.ts
- Lägg bara saker i shared när minst två features använder dem

### Backend: lagerstruktur i ett enda projekt (Capcache.Api)
- Models/ (entiteter), Data/ (AppDbContext, Migrations), Dtos/, Services/, Controllers/
- Controllers är tunna: validerar indata, anropar en service och returnerar resultatet
- Logik och databasfrågor ligger i Services/. Controllers rör inte AppDbContext
- Interface bara där det behövs: IStorageService (R2/MinIO) och ICurrentUser. Inte ett interface per service
- Alla frågor är begränsade till inloggad användare via globala query filters i AppDbContext (UserId via ICurrentUser). Mjuk borttagning (DeletedAt) har ett eget namngivet filter
- Hemligheter och anslutningssträngar i user-secrets eller miljövariabler

### Gemensamt
- Håll det enkelt: inga extra abstraktionslager utan tydligt behov

## MVP (bygg bara detta)
1. Inloggning med GitHub OAuth
2. Lägga till skärmdumpar: dra och släpp, samt klistra in (Ctrl/Cmd+V), med valfritt URL- och titelfält
3. Konvertering till WebP i webbläsaren (canvas), cirka 150 KB per bild, före uppladdning
4. Bild till R2, metadata till databasen (titel, URL, tidpunkt, filstorlek, upplösning)
5. Bibliotek: en rutnätsvy, nyast först, lazy loading, skeleton-states
6. Sökning på titel och URL (Ctrl/Cmd+K)
7. Samlingar: skapa, byta namn, färgmärka, flytta bilder
8. Filter på domän (härleds från URL, med antal per domän)
9. Detaljvy/lightbox med piltangenter, kopiera, ladda ner, ta bort med ångra
10. Tomt läge
11. Deploy så att det fungerar online

## Bygg INTE nu (finns i designen men hoppas över)
Taggar, olika rutnätslayouter och täthetsväxlare, Chrome-tillägg, onboarding,
inställningar, mobilvy, mörkt tema, lagringsmätare.

## Arbetssätt
- Gör alltid en plan först och vänta på godkännande
- Bygg i etapper: frontend med exempeldata, sedan datamodell + API, uppladdning till R2, koppling, deploy
- Lägg inte till funktioner utöver MVP-listan
- Hemligheter (R2-nycklar, OAuth) i miljövariabler, aldrig i koden

## Framtida funktioner (bygg inte nu, men tänk på dem)
- Chrome-tillägg som fångar skärmdumpar direkt från webbläsaren, med automatisk URL, titel och favicon
- Bakgrundsapp som vaktar den lokala skärmdumpsmappen och laddar upp nya bilder
- OCR så att texten i bilder blir sökbar
- Automatiska taggar från domän och titel
- Tidslinjevy

Uppladdningen ska ligga i en egen endpoint som tar emot en färdig bild och metadata,
så att den kan återanvändas av tillägget och bakgrundsappen utan ändringar.