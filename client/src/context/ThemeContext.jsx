import React, { createContext, useContext, useState } from 'react'


const ThemeContext = createContext()
export const useTheme = () => useContext(ThemeContext)


export function ThemeProvider({ children }) {
const [theme, setTheme] = useState('light')
const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light')


return (
<ThemeContext.Provider value={{ theme, toggle }}>
<div className={theme === 'dark' ? 'dark' : ''}>{children}</div>
</ThemeContext.Provider>
)
}