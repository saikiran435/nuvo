# Nuvo Circle

A mobile-first prototype of a Green Passport for children. Missions earn non-cash Green Credits. Nothing is uploaded, and Green Credits cannot be bought.

This build covers the foundation and the child loop: welcome, the path, missions, the passport, and a parent approval step. Quizzes, stories, the league, and the shop are previewed and open in later chapters.

## Run

```bash
npm install
npm run dev
```

Open the URL printed by Next.js. The dev server in this workspace uses port 3847:

```bash
npx next dev --hostname 0.0.0.0 --port 3847
```

## Checks

```bash
npm run typecheck
npm run lint
npm test
```

## Reset

Open `/dev`. **Reset demo data** restores Ishaan's passport. **Replay welcome** starts onboarding again. Both clear photos stored in this browser.
