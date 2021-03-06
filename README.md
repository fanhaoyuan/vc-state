# vc-state

A minify local state by using vue composition api.

[![](https://data.jsdelivr.com/v1/package/npm/vc-state/badge?style=rounded)](https://www.jsdelivr.com/package/npm/vc-state)
<a href="https://npmjs.com/package/vc-state"><img src="https://img.shields.io/npm/v/vc-state.svg" alt="npm package"></a>

## Features

-   🔧 Simple api and easy to use
-   ⚡️ Fast and light weight (less than **1kb**)
-   🔑 Typescript supported
-   💨 Free combination hooks, written entirely in composition api

## Install

```bash
$> pnpm add vc-state
#or with npm
$> npm install vc-state
#or with yarn
$> yarn add vc-state
```

with CDN

```html
<script src="https://cdn.jsdelivr.net/npm/vc-state/dist/vc-state.min.js"></script>
```

## Usage

### Basic

1. Create a custom context.

```ts
// @/context.ts
import { createContext } from 'vc-state';

interface AppContext {
    count: number;
}

const initialContext: AppContext = {
    count: 0,
};

// You can rename by yourself.
const [appContext, useAppContext] = createContext(initialContext);

export { appContext, useAppContext };
```

2. Use custom context in vue component.

```tsx
// Component.tsx
import { defineComponent, toRefs } from 'vue';
import { useAppContext } from '@/context';

export default defineComponent({
    setup() {
        const { context: appContext } = useAppContext();

        //If want to use a ref value, use `toRefs` to transform context.
        //You can watch or watchEffect `count` now.
        const { count } = toRefs(appContext);

        return () => {
            return <div>{appContext.count}</div>;
            //return <div>{count.value}</div>
        };
    },
});
```

### Advanced

1. Create a custom context.

```ts
// @/context.ts
import { createContext } from 'vc-state';
import { toRefs } from 'vue';

interface AppContext {
    count: number;
}

const initialContext: AppContext = {
    count: 0,
};

const [appContext, useAppContext] = createContext(initialContext, (context, setContext) => {
    //Define custom actions
    function countIncrement() {
        context.count++;
    }

    function setCount(count: number) {
        setCount('count', count);
    }

    //You even can watch context here
    const { count } = toRefs(context);
    watchEffect(() => {
        console.log('count value changed.', count.value);
    });

    //Will merge into appContext
    return { countIncrement, setCount };
});

export { appContext, useAppContext };
```

2. Use custom actions in component

```tsx
// Component.tsx
import { defineComponent, toRefs } from 'vue';
import { useAppContext } from '@/context';

export default defineComponent({
    setup() {
        const { context: appContext, countIncrement, setCount } = useAppContext();

        //If want to use a ref value, use `toRefs` to transform context.

        //You can watch or watchEffect `count` now.
        const { count } = toRefs(appContext);

        watchEffect(() => {
            console.log(count.value);
        })

        return () => {
            return (
                <>
                    <div>{appContext.count}</div> {/* Show count */}
                    <button onClick={countIncrement}><button> {/* Will add 1 to count */}
                    <button onClick={() => setCount(appContext.count + 10)}><button> {/* Will add 10 to count */}
                </>
            );
        };
    },
});
```

## API

### createContext

```ts
function createContext<S extends Record<string, any>, Selectors extends MutationInit<S>[] = MutationInit<S>[]>(
    initialContext: S,
    ...mutations: Selectors
): [DeepReadonly<State<S>>, () => Context<S, Selectors>];
```

-   `initialContext` - A initial state in context
-   `mutations` - Any custom hooks in context

## License

[MIT](LICENSE)
