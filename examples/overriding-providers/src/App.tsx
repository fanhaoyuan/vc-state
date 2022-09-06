import { computed, defineComponent, ref } from 'vue';
import { createContext } from 'vc-state';

type Theme = 'dark' | 'light';

interface ThemeContextProviderProps {
    defaultTheme: Theme;
    lightColor?: string;
    darkColor?: string;
}

const [ThemeContextProvider, useThemeContext] = createContext((props: ThemeContextProviderProps) => {
    const theme = ref<Theme>(props.defaultTheme);
    const toggleTheme = () => (theme.value = theme.value === 'dark' ? 'light' : 'dark');
    return { theme, toggleTheme };
});

const Button = defineComponent({
    name: 'Button',
    setup() {
        const { toggleTheme, theme } = useThemeContext();
        return () => {
            return <button onClick={toggleTheme}>to {theme.value === 'dark' ? 'light' : 'dark'}</button>;
        };
    },
});

const Panel = defineComponent({
    name: 'Panel',
    setup() {
        const { theme } = useThemeContext();
        const currentThemeColor = computed(() => (theme.value === 'dark' ? '#000' : '#fff'));
        const oppositeThemeColor = computed(() => (theme.value === 'dark' ? '#fff' : '#000'));

        return () => {
            return (
                <div
                    style={{
                        backgroundColor: currentThemeColor.value,
                        border: `1px ${oppositeThemeColor.value} solid`,
                        width: '300px',
                        height: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        color: oppositeThemeColor.value,
                    }}
                >
                    <p>I'm in {theme.value} mode</p>
                </div>
            );
        };
    },
});

export default defineComponent({
    name: 'App',
    setup() {
        return () => (
            // useContext receives the provided value of the nearest Provider
            <ThemeContextProvider defaultTheme='dark'>
                <ThemeContextProvider defaultTheme='light'>
                    <Panel />
                    <Button />
                </ThemeContextProvider>

                <ThemeContextProvider defaultTheme='dark'>
                    <Panel />
                    <Button />
                </ThemeContextProvider>

                <Panel />
                <Button />
            </ThemeContextProvider>
        );
    },
});
