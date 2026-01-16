import React, { createContext, useContext, ReactNode } from "react";
import type { Font } from "./FontConfig";

// Minimal default font config so components can safely read font families
const defaultFont: Font = {
    regular: undefined,
    bold: undefined,
    semiBold: undefined,
    medium: undefined,
    light: undefined,
    extraLight: undefined,
    italic: undefined,
    size: {
        XXXXS: 8,
        XXXS: 10,
        XXS: 11,
        XS: 12,
        S: 14,
        M: 16,
        L: 18,
        X: 20,
        XXL: 24,
        XXXL: 32,
    },
};

const FontContext = createContext<Font>(defaultFont);

export const FontProvider = ({ children, font = defaultFont }: { children: ReactNode; font?: Font }) => {
    return <FontContext.Provider value={font}>{children}</FontContext.Provider>;
};

export const useFont = (): Font => {
    return useContext(FontContext);
};

export default FontContext;
