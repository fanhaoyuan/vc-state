import { defineComponent } from 'vue';
import { ThemeContextProvider, useThemeContext, theme } from './context';

const StyledText = defineComponent({
    name: 'StyledText',
    setup(props, { slots }) {
        const { textStyles } = useThemeContext();

        return () => {
            return <p style={textStyles}>{slots.default?.()}</p>;
        };
    },
});

const Button = defineComponent({
    name: 'Button',
    props: {
        color: String,
    },
    setup(props, { slots }) {
        const { updateTheme } = useThemeContext();

        return () => <button onClick={updateTheme.bind(null, props.color!)}>{slots.default?.()}</button>;
    },
});

export default defineComponent({
    name: 'App',
    setup() {
        return () => (
            <ThemeContextProvider>
                <StyledText>Primary</StyledText>
                <StyledText>Success</StyledText>
                <StyledText>Error</StyledText>
                <StyledText>Warning</StyledText>
                <Button color={theme.primaryColor}>to primary</Button>
                <Button color={theme.successColor}>to success</Button>
                <Button color={theme.errorColor}>to error</Button>
                <Button color={theme.warningColor}>to warning</Button>
            </ThemeContextProvider>
        );
    },
});
