export type Selector<Value extends Record<string, any>, Props extends {}> = (
    initialContext: Value,
    props: Props
) => Record<string, any>;

export type DefineContext<
    Value extends Record<string, any>,
    Props extends {},
    Selectors extends Selector<Value, Props>[]
> = {
    [Key in keyof Selectors]: Selectors[Key] extends Selector<Value, Props> ? ReturnType<Selectors[Key]> : {};
};

export type First<F extends Record<string, any>, R extends Record<string, any>[]> = [F, ...R];

export type MergeContext<H extends Record<string, any>[]> = H extends []
    ? {}
    : H extends First<infer C, []>
    ? C
    : H extends First<infer C, infer R>
    ? C & MergeContext<R>
    : {};

export type Context<
    Value extends Record<string, any>,
    Props extends {},
    Selectors extends Selector<Value, Props>[]
> = Value & MergeContext<DefineContext<Value, Props, Selectors>>;
