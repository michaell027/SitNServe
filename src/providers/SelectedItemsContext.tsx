import {MenuItem} from '../views/MenuListScreen';
import React, {useState} from 'react';

interface SelectedItemsProviderProps {
    children: React.ReactNode;
}

export const SelectedItemsContext = React.createContext({
    selectedItems: [] as MenuItem[],
    cartCount: 0,
    updateSelectedItems: (newItems: MenuItem[]) => {},
    updateCartCount: (newCount: number) => {},
});

export function SelectedItemsProvider({children}: SelectedItemsProviderProps) {
    const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
    const [cartCount, setCartCount] = useState(0);

    const updateSelectedItems = (newItems: MenuItem[]) => {
        setSelectedItems(newItems);
        updateCartCount(
            newItems.reduce((acc, item) => acc + (item.quantity || 0), 0),
        );
    };

    const updateCartCount = (newCount: number) => {
        setCartCount(newCount);
    };

    return (
        <SelectedItemsContext.Provider
            value={{
                selectedItems,
                cartCount,
                updateSelectedItems,
                updateCartCount,
            }}>
            {children}
        </SelectedItemsContext.Provider>
    );
}
