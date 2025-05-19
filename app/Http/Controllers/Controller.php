<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    protected function sharedInertiaData()
    {
        return [
            'auth' => [
                'user' => auth()->check() ? [
                    'id' => auth()->user()->id,
                    'name' => auth()->user()->name,
                    'profile_picture' => auth()->user()->profile_picture
                ] : null
            ]
        ];
    }
}