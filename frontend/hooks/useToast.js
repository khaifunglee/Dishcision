// This hook is used to display toast messages in multiple screens
import { useState, useCallback } from "react";

export const useToast = () => {
    const [toast, setToast] = useState({ visible: false, message: '' })

    const showToast = useCallback((message) => {
        setToast({ visible: true, message })
        setTimeout(() => setToast({ visible: false, message }), 2500) // Prevent displaying duplicate toast messages
    }, [])

    return { toast, showToast }
}