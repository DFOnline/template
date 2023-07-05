# template

The new template viewer and editor.  

## Developing

After cloning the repository 
```bash
git clone https://github.com/DFOnline/template
```
Install the dependencies 
```bash
npm i
```
Boot up a development server
```bash
npm run dev
# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is the library, `src/routes` is the preview app used for testing.

## Building

To build the library:

```bash
npm run package
```

To create a production version of the preview app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.