export default function ApplicationLogo({ className }) {
    return (
        <img 
            src="/storage/images/NEXUS.jpg"  // ← Cambiado a /storage/images/
            alt="Tu Logo"
            className={className || 'h-8 w-auto'}
        />
    );
}