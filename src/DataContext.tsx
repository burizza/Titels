import React, { useState, useEffect, createContext } from 'react';
import ReactNode from 'react';

// Интерфейс для пропсов компонента DataProvider
interface DataProviderProps {
    children: ReactNode;
}

interface DataContextType {
    gameStart: boolean;
    setGameStart: React.Dispatch<React.SetStateAction<boolean>>;
    fieldSize: string;
    setFieldSize: React.Dispatch<React.SetStateAction<string>>;
    gameTime: number;
    setGameTime: React.Dispatch<React.SetStateAction<number>>;
    gameQuantity: number;
    setGameQuantity: React.Dispatch<React.SetStateAction<number>>;
    repeatgame: any;   // Пример: типизируйте, если это значение известно
    mistake: any;      // Пример: типизируйте, если это значение известно
    currentScore: any; // Пример: типизируйте, если это значение известно
    time: any;         // Пример: типизируйте, если это значение известно
}


export const DataContext = createContext();

const DataProvider = ({ children }) => {
    const getLocalStorage = (key: string, defaultValue: any) => {
        const value = localStorage.getItem(key);
        try {
            return value !== null ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error(`Ошибка при парсинге данных из localStorage для ключа "${key}":`, error);
            return defaultValue; // Возвращаем значение по умолчанию, если ошибка парсинга
        }
    }

    const [gameStart, setGameStart] = useState(() => getLocalStorage("game-start", true));
    const [gameQuantity, setGameQuantity] = useState(parseInt(sessionStorage.getItem("gameQuantity") || "0", 10));

    // Настройки пользователя
    const [fieldSize, setFieldSize] = useState(() => getLocalStorage("fieldSize", '2'));
    const [gameTime, setGameTime] = useState(() => getLocalStorage("gameTime", 60));

    useEffect(() => {
        sessionStorage.setItem("gameQuantity", JSON.stringify(gameQuantity));
    }, [gameQuantity]);

    useEffect(() => {
        localStorage.setItem("game-start", JSON.stringify(gameStart));
    }, [gameStart]);

    useEffect(() => {
        localStorage.setItem("fieldSize", JSON.stringify(fieldSize));
    }, [fieldSize]);

    useEffect(() => {
        localStorage.setItem("gameTime", JSON.stringify(gameTime));
    }, [gameTime]);

    const value = {
        gameStart,
        setGameStart,
        fieldSize,
        setFieldSize,
        gameTime,
        setGameTime,
        gameQuantity,
        setGameQuantity,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;