import { h, Fragment, provide, InjectionKey, inject, defineComponent, FunctionalComponent } from 'vue';
import { Selector, Context } from './interfaces';

/**
 * Compose context with hooks
 * @param useValue function for init context state
 * @param selectors hooks with context
 */
export function createContext<Props extends {}, Value extends Record<string, any>, Selectors extends Selector<Value>[]>(
    useValue: (props: Props) => Value,
    ...selectors: Selectors
) {
    const injectionKey: InjectionKey<Context<Value, Selectors>> = Symbol();

    const NO_PROVIDER = {};

    const ContextProvider: FunctionalComponent<Props> = (props, { slots }) => {
        return h(
            defineComponent({
                name: 'Provider',
                setup() {
                    const context = useValue(props);

                    const hookContextValues = selectors.reduce((merged, selector) => {
                        return Object.assign({}, merged, selector.call(null, context));
                    }, Object.create(null));

                    provide(injectionKey, Object.assign({}, context, hookContextValues));

                    return () => h(Fragment, slots.default?.());
                },
            })
        );
    };

    function dispatch() {
        const context = inject(injectionKey, NO_PROVIDER) as Context<Value, Selectors>;

        if (context === NO_PROVIDER) {
            console.warn('[vc-state] The ContextProvider is never used.');
        }

        return context;
    }

    return [ContextProvider, dispatch] as const;
}
