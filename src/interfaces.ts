export type Selector<Value extends Record<string, any>> = (value: Value) => Record<string, any>;

export type DefineContext<Value extends Record<string, any>, Selectors extends Selector<Value>[]> = {
    [Key in keyof Selectors]: Selectors[Key] extends Selector<Value> ? ReturnType<Selectors[Key]> : {};
};

export type First<F extends Record<string, any>, R extends Record<string, any>[]> = [F, ...R];

export type MergeContext<H extends Record<string, any>[]> = H extends []
    ? {}
    : H extends First<infer C, []>
    ? C
    : H extends First<infer C, infer R>
    ? C & MergeContext<R>
    : {};

export type Context<Value extends Record<string, any>, Selectors extends Selector<Value>[]> = Value &
    MergeContext<DefineContext<Value, Selectors>>;
