import { ComputedRef, DeepReadonly, readonly } from 'vue';
import { useState, SetState, State } from './useState';

type FilterKeys<T, U> = {
    [key in keyof T]: T[key] extends U ? never : key;
}[keyof T];

type Filter<T, U> = Pick<T, FilterKeys<T, U>>;

type Getter<G = any> = ComputedRef<G>;
type Action<D = any, P extends any[] = any[]> = (...args: P) => D;

type Mutation<M = any> = M extends Getter ? M : M extends Action ? M : never;

type MutationRecord<T = Record<string, any>> = {
    [K in keyof T]: Mutation<T[K]>;
};

type SelectorArray<Head extends Record<string, any>, Tail extends Record<string, any>[]> = [Head, ...Tail];

type MergeMutationArray<Arr extends Record<string, any>[]> = Arr extends []
    ? {}
    : Arr extends SelectorArray<infer Head, []>
    ? Head
    : Arr extends SelectorArray<infer Head, infer Tail>
    ? Head & MergeMutationArray<Tail>
    : never;

type MutationInit<S> = (state: State<S>, setState: SetState<S>) => any;

type DefineMutations<S, Selectors> = {
    [K in keyof Selectors]: Selectors[K] extends (state: State<S>, setState: SetState<S>) => infer R
        ? R extends object
            ? Filter<MutationRecord<R>, never>
            : {}
        : {};
};

type Context<S, Selectors extends MutationInit<S>[]> = {
    context: DeepReadonly<State<S>>;
    setContext: SetState<S>;
} & MergeMutationArray<DefineMutations<S, Selectors>>;

export function createContext<S extends Record<string, any>, Selectors extends MutationInit<S>[] = MutationInit<S>[]>(
    initialContext: S,
    ...mutations: Selectors
): [DeepReadonly<State<S>>, () => Context<S, Selectors>] {
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
