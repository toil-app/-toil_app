import React, { createContext, useContext, ReactNode } from 'react'
import { AppTheme } from './Theme'



export const ThemeContext = createContext<AppTheme | undefined>(undefined)

export const ThemeProvider = ({
    children,
    theme
}: {
    children: ReactNode
    theme: AppTheme
}) => <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>

export const useTheme = (): AppTheme => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}
