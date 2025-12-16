import { createContext, useContext, useState } from "react";

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
    const [menuConfig, setMenuConfig] = useState({
        direction: 'left',
        orderUid: null,
    })

    return (
        <AppContext.Provider value={{ menuConfig, setMenuConfig }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext)
