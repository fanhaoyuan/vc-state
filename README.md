<div align="center">
<h1>vc-state</h1>

Easily to compose scoped state in Vue.js

<a href="https://unpkg.com/vc-state"><img alt="Size" src="https://img.badgesize.io/https://unpkg.com/vc-state"></a>
<a href="https://npmjs.com/package/vc-state"><img src="https://img.shields.io/npm/v/vc-state.svg" alt="npm package"></a>

</div>

## Examples in CodeSandbox

-   [ThemeContextProvider](https://codesandbox.io/s/github/fanhaoyuan/vc-state/tree/master/examples/theme-context-provider)
-   [OverridingProviders](https://codesandbox.io/s/github/fanhaoyuan/vc-state/tree/master/examples/overriding-providers)
-   [NestedProviders](https://codesandbox.io/s/github/fanhaoyuan/vc-state/tree/master/examples/nested-providers)

## Install

### NPM

```bash
>$ npm install vc-state

# or using yarn
>$ yarn install vc-state

# or using pnpm
>$ pnpm add vc-state
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/vc-state/dist/vc-state.min.js"></script>
```

## Basic Usage Examples (ThemeContextProvider)

```tsx
import { computed, defineComponent, ref } from 'vue';
import { createContext } from 'vc-state';

type Theme = 'dark' | 'light';

interface ThemeContextProviderProps {
    defaultTheme: Theme;
    lightColor?: string;
    darkColor?: string;
}

// Defined Required Props in useValue function
const [ThemeContextProvider, useThemeContext] = createContext((props: ThemeContextProviderProps) => {
    const theme = ref<Theme>(props.defaultTheme);
    const toggleTheme = () => (theme.value = theme.value === 'dark' ? 'light' : 'dark');
    return { theme, toggleTheme };
});

const Button = defineComponent({
    name: 'Button',
    setup() {
        const { toggleTheme, theme } = useThemeContext();
        return () => {
            return <button onClick={toggleTheme}>to {theme.value === 'dark' ? 'light' : 'dark'}</button>;
        };
    },
});

const Panel = defineComponent({
    name: 'Panel',
    setup() {
        const { theme } = useThemeContext();
        const currentThemeColor = computed(() => (theme.value === 'dark' ? '#000' : '#fff'));
        const oppositeThemeColor = computed(() => (theme.value === 'dark' ? '#fff' : '#000'));

        return () => {
            return (
                <div
                    style={{
                        backgroundColor: currentThemeColor.value,
                        border: `1px ${oppositeThemeColor.value} solid`,
                        width: '300px',
                        height: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        color: oppositeThemeColor.value,
                    }}
                >
                    <p>I'm in {theme.value} mode</p>
                </div>
            );
        };
    },
});

export default defineComponent({
    name: 'App',
    setup() {
        return () => (
            // defaultTheme is required
            // lightColor and darkColor are optional
            <ThemeContextProvider defaultTheme='light'>
                <Panel />
                <Button />
            </ThemeContextProvider>
        );
    },
});
```

## API

### createContext

`createContext(useValue[, ...hooks]): Context`

It will return a context which compose with `initial context` and `patch context`

#### useValue

This is required in a `createContext`.

This function returns an object which is `initial context`.

```ts
import { createContext } from 'vc-state';

const context = createContext((props: { a: string }) => {
    return {
        b: '',
    };
});

// In Vue Components
console.log(context.useContext()); //  { b: '' }
```

#### hooks

`Hooks` is a group of optional functions in `createContext`.

It receives `initial context` in the first parameter. And it will return a object which is `patch context`, it Will compose with `initial context`.

```ts
import { createContext } from 'vc-state';

const context = createContext(
    (props: { a: string }) => {
        return {
            b: '',
        };
    },
    initialContext => {
        console.log(initialContext.b); // ''

        return {
            c: 1,
        };
    }
);

// In Vue Components
console.log(context.useContext()); //  { b: '', c: 1 }
```

### displayName

We can set custom displayName in `vue-tools` for `Provider`. Default is `Provider`.

Added in `v1.2.0`.

```ts
import { createContext } from 'vc-state';

const [ContextProvider, useThemeContext] = createContext(() => {
    return {
        // context
    };
});

ContextProvider.displayName = 'ThemeContextProvider';

export { ContextProvider, useThemeContext };
```

## License

[MIT](./LICENSE)
