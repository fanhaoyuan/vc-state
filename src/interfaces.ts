import { ComputedRef, DeepReadonly, UnwrapNestedRefs } from 'vue';

/**
 * Reactive state
 */
export type State<S> = UnwrapNestedRefs<S>;

/**
 * A function for set state
 */
export interface SetState<S> {
    <K extends keyof S>(key: K, value: S[K]): S[K];
    (key: Partial<S>): S;
}

/**
 * Readonly only state, can not assign value in state
 */
export type ReadonlyState<S> = DeepReadonly<State<S>>;

export type Getter<G = any> = ComputedRef<G>;

export type Action<D = any, P extends any[] = any[]> = (...args: P) => D;

export type Mutation = Action | Getter;

/**
 * Functions for set up mutation.
 *
 * Can be compose with composition api.
 */
export type MutationInit<S> = (state: S, setState: SetState<S>) => any;

/**
 * Array of mutation.
 */
export type Mutations<H extends Record<string, any>, T extends Record<string, any>[]> = [H, ...T];

/**
 * Merge mutation array to an object of mutations.
 */
export type MergeMutations<A extends Record<string, any>[]> = A extends []
    ? {}
    : A extends Mutations<infer H, []>
    ? H
    : A extends Mutations<infer H, infer T>
    ? H & MergeMutations<T>
    : never;

/**
 * Get Mutation.
 */
export type MutationRecord<T> = Pick<
    T,
    {
        [K in keyof T]: T[K] extends Mutation ? K : never;
    }[keyof T]
>;

export type DefineMutations<S, M extends MutationInit<S>[]> = {
    [L in keyof M]: M[L] extends (state: S, setState: SetState<S>) => infer R
        ? R extends Record<string, any>
            ? MutationRecord<R>
            : {}
        : {};
};

/**
 * Global context.
 */
export type GlobalContext<S, M extends MutationInit<S>[]> = MergeMutations<DefineMutations<S, M>>;

/**
 * A function wrapper of global context.
 */
export type GlobalContextWrapper<S, M extends MutationInit<S>[]> = () => GlobalContext<S, M>;
