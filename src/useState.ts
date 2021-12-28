import { reactive, UnwrapNestedRefs } from 'vue';

export type State<K> = UnwrapNestedRefs<K>;

export interface SetState<K> {
    <T extends keyof K>(key: T, value: K[T]): K[T];
    (key: Partial<K>): K;
}

export function useState<K extends Record<string, any>>(initialState: K): [State<K>, SetState<K>] {
    const state = reactive(initialState);

    function setState<T extends keyof K>(key: T, value: K[T]): K[T];
    function setState(key: Partial<K>): K;
    function setState<T extends keyof K>(key: T | Partial<K>, value?: T[keyof T]) {
        if (typeof key === 'string') {
            return Object.assign(state, { [key]: value });
        }

        return Object.assign(state, key);
    }

    return [state, setState];
}
