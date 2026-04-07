<?php

namespace App\Http\Controllers\Api\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JobNotificationForm;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'company') {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $company = $user->company;

        if (!$company) {
            return response()->json(['success' => false, 'message' => 'Company profile not found'], 404);
        }

        $forms = JobNotificationForm::where('company_id', $company->id)->get();
        
        $stats = [
            'total_jnf' => $forms->where('form_type', 'JNF')->count(),
            'total_inf' => $forms->where('form_type', 'INF')->count(),
            'pending' => $forms->whereIn('status', ['submitted', 'under_review'])->count(),
            'approved' => $forms->where('status', 'approved')->count(),
            'rejected' => $forms->where('status', 'rejected')->count(),
        ];

        $submissions = JobNotificationForm::with(['company', 'jobProfile'])
            ->where('company_id', $company->id)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'submissions' => $submissions,
                'company' => $company
            ]
        ]);
    }
}
