import { jwtDecode } from "jwt-decode"; 
import { createContext, useEffect, useState } from "react";

export let mediaContext = createContext(null);

export default function MediaContextProvider(props) {
    const [userData, setUserData] = useState(null); 
    const [Role, setRole] = useState('');
    
    let saveUserData = () => {
        let encodedToken = localStorage.getItem("token");
        if (encodedToken) {
            try {
                let decodedToken = jwtDecode(encodedToken);
                console.log('Decoded Token:', decodedToken);
                setUserData(decodedToken); 
                setRole(decodedToken.role || 'user');
                
                // ✅ SAVE USER ID TO LOCALSTORAGE
                if (decodedToken.userId) {
                    localStorage.setItem('userId', decodedToken.userId);
                }
            } catch (error) {
                console.error('Token decode error:', error);
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                setUserData(null);
                setRole('');
            }
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            saveUserData(); 
        }
    }, []); 

    let LogOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUserData(null);
        setRole('');
    };

    return (
        <mediaContext.Provider value={{ saveUserData, userData, Role, LogOut }}>
            {props.children}
        </mediaContext.Provider>
    );
}