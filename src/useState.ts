import { reactive } from 'vue';
import { State, SetState } from './interfaces';

/**
 * A helper function for set state
 * @param initialState
 * @returns
 */
export function useState<S extends Record<string, any>>(initialState: S): [State<S>, SetState<S>] {
    const state = reactive(initialState);

    function setState<K extends keyof S>(key: K, value: S[K]): S[K];
    function setState(key: Partial<S>): S;
    function setState<K extends keyof S>(key: K | Partial<S>, value?: S[K]) {
        if (typeof key === 'string') {
            return Object.assign(state, { [key]: value });
        }

        return Object.assign(state, key);
    }

    return [state, setState];
}
