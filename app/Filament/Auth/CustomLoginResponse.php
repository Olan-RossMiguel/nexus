<?php

namespace App\Filament\Auth;

use Filament\Http\Responses\Auth\LoginResponse as BaseLoginResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CustomLoginResponse extends BaseLoginResponse
{
    public function toResponse($request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Debug
        Log::debug('Login redirect', [
            'user_id' => $user->id,
            'is_admin' => $user->is_admin
        ]);

        // Redirección compatible con Inertia+Livewire
        if ($user && $user->getRawOriginal('is_admin') == 1) {
            return $this->createRedirectResponse('filament.admin.pages.dashboard');
        }

        return $this->createRedirectResponse('muro');
    }

    protected function createRedirectResponse(string $route): RedirectResponse
    {
        return new \Illuminate\Http\RedirectResponse(
            route($route),
            302,
            ['X-Inertia' => true]  // Cabecera importante para Inertia
        );
    }
}
