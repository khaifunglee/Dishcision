// This file stores onboarding context for newly registered users to follow
import { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store'

const OnboardingContext = createContext()

export const OnboardingProvider = ({ children }) => {
    const [shouldOnboard, setShouldOnboard] = useState(false)
    // Trigger after a user has registered only
    const triggerOnboarding = async () => {
        await SecureStore.setItemAsync('show_onboarding', 'true')
        setShouldOnboard(true)
    }
    // Complete after user finishes onboarding steps (one-off)
    const completeOnboarding = async () => {
        await SecureStore.deleteItemAsync('show_onboarding')
        setShouldOnboard(false)
    }

    return (
        <OnboardingContext.Provider value={{
            shouldOnboard,
            triggerOnboarding,
            completeOnboarding,
        }}>
            {children}
        </OnboardingContext.Provider>
    )
}

export const useOnboarding = () => useContext(OnboardingContext)