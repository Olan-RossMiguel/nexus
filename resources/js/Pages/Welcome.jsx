import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome() {
    return (
        <>
            <Head title="NEXUS - Plataforma Científica" />
            
            {/* Navbar */}
            <nav className="bg-dark-custom shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/">
                                <img 
                                    src="/storage/images/NEXUS.jpg" 
                                    alt="NEXUS Logo"
                                    className="h-10 w-auto"
                                />
                            </Link>
                        </div>
                        
                        {/* Menú de navegación */}
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link 
                                href="/about" 
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Sobre Nexus
                            </Link>
                            <Link 
                                href="/science" 
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Ciencia
                            </Link>
                            <Link 
                                href="/research" 
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Investigación
                            </Link>
                        </div>
                        
                        {/* Botones de autenticación */}
                        <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                            <Link
                                href={route('login')}
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href={route('register')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Registrarse
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <main className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center py-16">
                        <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                            Plataforma Científica Nexus
                        </h1>
                        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-300">
                            Conectando el conocimiento científico con el mundo
                        </p>
                    </div>

                    {/* Sección de características */}
                    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Tarjeta 1 */}
                        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-white">Investigación Avanzada</h3>
                                <p className="mt-2 text-base text-gray-300">
                                    Accede a las últimas publicaciones científicas y colabora con investigadores de todo el mundo.
                                </p>
                            </div>
                        </div>

                        {/* Tarjeta 2 */}
                        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-white">Análisis de Datos</h3>
                                <p className="mt-2 text-base text-gray-300">
                                    Herramientas potentes para el procesamiento y visualización de datos científicos.
                                </p>
                            </div>
                        </div>

                        {/* Tarjeta 3 */}
                        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-4">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-white">Comunidad Global</h3>
                                <p className="mt-2 text-base text-gray-300">
                                    Conéctate con una red internacional de científicos y colaboradores.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sección de ciencia destacada */}
                    <div className="mt-16">
                        <h2 className="text-3xl font-extrabold text-white text-center mb-8">
                            Descubre la Ciencia con Nexus
                        </h2>
                        
                        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Explora los últimos avances científicos</h3>
                                    <p className="text-gray-300 mb-6">
                                        Nexus es una plataforma que muestra de forma divertida avances científicos.
                                    </p>
                                    <Link 
                                        href="/science" 
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Explorar Ciencia
                                    </Link>
                                </div>
                                <div className="bg-gray-700 rounded-lg p-4">
                                    <div className="aspect-w-16 aspect-h-9">
                                        <img 
                                            src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                                            alt="Ciencia" 
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-dark-custom text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <img 
                                src="/storage/images/NEXUS.jpg" 
                                alt="NEXUS Logo" 
                                className="h-8 w-auto"
                            />
                            <span className="text-lg font-semibold">NEXUS</span>
                        </div>
                        <div className="flex space-x-6">
                            <Link href="/about" className="text-gray-300 hover:text-white">
                                Sobre Nosotros
                            </Link>
                            <Link href="/contact" className="text-gray-300 hover:text-white">
                                Contacto
                            </Link>
                            <Link href="/privacy" className="text-gray-300 hover:text-white">
                                Privacidad
                            </Link>
                            <Link href="/terms" className="text-gray-300 hover:text-white">
                                Términos
                            </Link>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-gray-400 text-sm">
                        © {new Date().getFullYear()} Plataforma Científica Nexus. Todos los derechos reservados.
                    </div>
                </div>
            </footer>
        </>
    );
}