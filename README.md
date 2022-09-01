<div align="center">
<h1>vc-state</h1>

Managing context by using composable api

[![](https://data.jsdelivr.com/v1/package/npm/vc-state/badge?style=rounded)](https://www.jsdelivr.com/package/npm/vc-state)
<a href="https://npmjs.com/package/vc-state"><img src="https://img.shields.io/npm/v/vc-state.svg" alt="npm package"></a>

</div>

# Examples

-   [ThemeContextProvider](https://codesandbox.io/s/github/fanhaoyuan/vc-state/tree/master/examples/theme-context-provider)

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

## Usage

### Basic

```tsx
import { defineComponent } from 'vue';
import { createContext } from 'vc-state';

function useCounter() {
    const state = reactive({
        count: 0,
    });

    const add = () => state.count++;

    const minus = () => state.count--;

    return {
        state,
        add,
        minus,
    };
}

const [ContextProvider, useContext] = createContext(useCounter);

const AddButton = defineComponent({
    name: 'AddButton',
    setup() {
        const { add } = useContext();

        return () => <button onClick={add}>add</button>;
    },
});

const MinusButton = defineComponent({
    name: 'MinusButton',
    setup() {
        const { minus } = useContext();

        return () => <button onClick={minus}>minus</button>;
    },
});

const Counter = defineComponent({
    name: 'Counter',
    setup() {
        const { state } = useContext();

        return () => <div>{state.count}</div>;
    },
});

const App = defineComponent({
    name: 'App',
    setup() {
        return () => (
            <ContextProvider>
                <AddButton />
                <Counter />
                <MinusButton />
            </ContextProvider>
        );
    },
});
```

### Advanced

```tsx
import { defineComponent, reactive, computed, toRefs } from 'vue';
import { createContext } from 'vc-state';

function useCounter() {
    const state = reactive({
        count: 0,
    });

    const add = () => state.count++;

    const minus = () => state.count--;

    return {
        state,
        add,
        minus,
    };
}

function useDoubleCounter(context: ReturnType<typeof useCounter>) {
    const { count } = toRefs(context.state);

    const doubleCount = computed(() => count.value * 2);

    return {
        doubleCount,
    };
}

const [ContextProvider, useContext] = createContext(useCounter, useDoubleCounter);

const AddButton = defineComponent({
    name: 'AddButton',
    setup() {
        const { add } = useContext();

        return () => <button onClick={add}>add</button>;
    },
});

const MinusButton = defineComponent({
    name: 'MinusButton',
    setup() {
        const { minus } = useContext();

        return () => <button onClick={minus}>minus</button>;
    },
});

const Counter = defineComponent({
    name: 'Counter',
    setup() {
        const { state, doubleCount } = useContext();

        return () => (
            <>
                <div>normal: {state.count}</div>
                <div>double: {doubleCount.value}</div>
            </>
        );
    },
});

export default defineComponent({
    name: 'App',
    setup() {
        return () => (
            <ContextProvider>
                <AddButton />
                <Counter />
                <MinusButton />
            </ContextProvider>
        );
    },
});
```

## License

[MIT](./LICENSE)
