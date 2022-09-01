import { createContext } from 'vc-state';
import { reactive, ref, Ref, watchEffect } from 'vue';

interface DefaultTheme {
    theme: {
        primaryColor: string;
        successColor: string;
        warningColor: string;
        errorColor: string;
    };
    currentColor: Ref<string>;
    updateTheme: (theme: string) => void;
}

const defaultTheme = {
    primaryColor: '#1890ff',
    successColor: '#52c41a',
    warningColor: '#faad14',
    errorColor: '#f5222d',
};

function useDefaultTheme(): DefaultTheme {
    const currentColor = ref(defaultTheme.primaryColor);

    function updateTheme(t: string) {
        currentColor.value = t;
    }

    return {
        theme: defaultTheme,
        currentColor,
        updateTheme,
    };
}

function useTextTheme(context: DefaultTheme) {
    const { theme } = context;

    const textStyles = reactive({
        color: theme.primaryColor,
        fontSize: '14px',
    });

    watchEffect(() => {
        textStyles.color = context.currentColor.value;

        if (context.currentColor.value === theme.primaryColor) {
            textStyles.fontSize = '20px';
        } else {
            textStyles.fontSize = '14px';
        }
    });

    return { textStyles };
}

const [ThemeContextProvider, useThemeContext] = createContext(useDefaultTheme, useTextTheme);

export { ThemeContextProvider, defaultTheme as theme, useThemeContext };
