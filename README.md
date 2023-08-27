# eslint-plugin-force-barrel-imports

--------

This ESLint plugin adds a single rule `force-barrel-imports` that prevents importing a JavaScript/TypeScript file directly if it has a parent barrel file (`index.js`/`index.ts`).
This helps enforce internal modularization of projects and promote file-level visibility control.

Consider the following file structure for example:
```
root
├ module1
│ ├ index.ts
│ └ private1.ts
│
├ module2
│ ├ index.ts
│ └ private2.ts
│
└ top.ts
```

The rule will forbid directly importing `private1.ts` file from outside of `module1` folder.
Symbols defined in `private1.ts` can only be accessed from `top.ts` and `private2.ts` if they are re-exported from `module1/index.ts`.

Rule allows reaching to parent files. In this case, both `private1.ts` and `private2.ts` can reach to `top.ts`. Reaching to parent `index.ts` is not allowed.

Modules can contain other modules, in this case same rules apply.
```
root
├ module1
│ ├ module3
│ │ ├ index.ts
│ │ └ private3.ts
│ │
│ ├ index.ts
│ └ private1.ts
│
├ module2
│ ├ index.ts
│ └ private2.ts
│
└ top.ts
```

- `private1.ts` can reach to `module3/index.ts` but not to `private3.ts`
- `private3.ts` can reach to `private1.ts`, `module2/index.ts` and `top.ts`
- `top.ts` can reach to `module1/index.ts` and `module2/index.ts`, but not to any of the `private*.ts` files

## Installation

This plugin depends on the resolver logic from [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import), so it has to be installed too along with the required resolvers.

```bash
npm install --save-dev \
  eslint-plugin-force-barrel-imports \
  eslint-plugin-import \
  eslint-import-resolver-node \
  eslint-import-resolver-typescript
```

Enable both plugins, resolvers, and the `force-barrel-imports` rule in the eslint config of your project (`.eslintrc.json`):
```json
{
  "plugins": [
    "import",
    "force-barrel-imports"
  ],
  "rules": {
    "force-barrel-imports/force-barrel-imports": "error"
  },
  "settings": {
    "import/resolver": {
      "typescript": true,
      "node": true
    }
  }
}
```

If you are not using TypeScript, `eslint-import-resolver-typescript` and `"typescript": true` should be omitted.
