// resources/js/Components/FlashMessages.jsx
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function FlashMessages() {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.success) {
            // Puedes usar un toast notification aquí
            alert(flash.success);
        }
        if (flash.error) {
            alert(flash.error);
        }
    }, [flash]);

    return null;
}
