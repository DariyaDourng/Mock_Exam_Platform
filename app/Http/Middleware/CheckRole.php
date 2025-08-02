<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  mixed  ...$roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            // User is guest (not logged in)
            // Allow if it's landing page, else block
            if ($request->is('/')) { // or your landing page route
                return $next($request);
            }
            return response()->json(['error' => 'Unauthorized, guests only allowed on landing page'], 403);
        }

        $userRole = Auth::user()->role->name;

        // Check if user's role is in allowed roles
        if (in_array($userRole, $roles)) {
            return $next($request);
        }

        return response()->json(['error' => 'Unauthorized, this role not allowed'], 403);
    }
}