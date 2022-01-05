import { readonly } from 'vue';
import { MutationInit, GlobalContextWrapper, ReadonlyState } from './interfaces';
import { useState } from './useState';

export function createContext<S extends Record<string, any>, M extends MutationInit<S>[] = MutationInit<S>[]>(
    initialContext: S,
    ...mutations: M
): [ReadonlyState<S>, GlobalContextWrapper<S, M>] {
    const [context, setContext] = useState(initialContext);

    const registeredMutations = mutations.reduce((registered, mutation) => {
        return Object.assign({}, registered, mutation.call(null, context, setContext));
    }, Object.create(null));

    const readonlyContext = readonly(context);

    function useContext() {
        return {
            context: readonlyContext,
            setContext,
            ...registeredMutations,
        };
    }

    return [readonlyContext, useContext];
}
