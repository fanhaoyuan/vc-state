import { createContext } from 'vc-state';
import { computed } from 'vue';
import { useThemeContext } from '../theme.context';

const [PanelThemeContextProvider, usePanelThemeContext] = createContext(() => {
    const { theme } = useThemeContext();

    const currentThemeColor = computed(() => (theme.value === 'dark' ? '#000' : '#fff'));
    const oppositeThemeColor = computed(() => (theme.value === 'dark' ? '#fff' : '#000'));

    const styles = computed(() => {
        return {
            backgroundColor: currentThemeColor.value,
            border: `1px ${oppositeThemeColor.value} solid`,
            width: '300px',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: oppositeThemeColor.value,
        };
    });

    return {
        styles,
    };
});

export { PanelThemeContextProvider, usePanelThemeContext };
