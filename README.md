# Sacred Interactive Map

The map can viewed at https://sacredmap.netlify.app/

## Development notes

Map dimensions are 50944x25600px (199x100 tiles). Each tile has a size of 256x256px.

Coefficients for the function to translate map coords to game coords were calculated assuming 4 corners of the map:

```
25608,0 = 0,0
0,12672 = 0,6400
51216,12672 = 6400,0
25608,25344 = 6400,6400
```

### Environment variables

| Name                          | Default value | Description                                                                                                                                                                               |
| ----------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_SHOULD_DRAW_TILE_EDGES` | `false`       | Draws borders around rendered tiles, resulting in grid-like view.                                                                                                                         |
| `VITE_SHOULD_DRAW_COORDS`     | `false`       | Draws coords near the cursor.                                                                                                                                                             |
| `VITE_SHOULD_USE_GAME_COORDS` | `false`       | When `true`, displayed coords near the cursor are in-game coords. When `false`, displayed coords are map coords. This only has an effect when `VITE_SHOULD_DRAW_COORDS` is set to `true`. |

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```
