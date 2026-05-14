// This hook is used to display toast messages in multiple screens
import { useState, useCallback } from "react";

export const useToast = () => {
    const [toast, setToast] = useState({ visible: false, message: '' })

    const showToast = useCallback((message) => {
        setToast({ visible: true, message })
        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }))
        }, 2500)
    }, [])

    return { toast, showToast }
}