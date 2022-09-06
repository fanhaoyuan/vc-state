import { defineComponent } from 'vue';
import { ThemeContextProvider, useThemeContext } from './theme.context';
import { Panel } from './Panel';

const Button = defineComponent({
    name: 'Button',
    setup() {
        const { toggleTheme, theme } = useThemeContext();
        return () => {
            return <button onClick={toggleTheme}>to {theme.value === 'dark' ? 'light' : 'dark'}</button>;
        };
    },
});

export default defineComponent({
    name: 'App',
    setup() {
        return () => (
            <ThemeContextProvider>
                <Panel />
                <Button />
            </ThemeContextProvider>
        );
    },
});
