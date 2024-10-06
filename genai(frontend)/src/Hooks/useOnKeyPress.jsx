import React, { useEffect } from "react";

export const OnPressKey = (fn, targetkey) => {
    useEffect(()=>{
        const listener = (event) => {
            if (event.key === targetkey) {
                fn();
            }
        };
        document.addEventListener('keydown', listener);
        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, [fn, targetkey])
}