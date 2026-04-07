<?php

namespace App\Http\Controllers\Api\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'company') {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $company = $user->company;

        if (!$company) {
            return response()->json(['success' => false, 'message' => 'Company profile not found'], 404);
        }

        $request->validate([
            'company_name' => 'required|string|max:255',
            'website' => 'nullable|url',
            'sector' => 'required|string',
            'org_type' => 'required|string',
            'postal_address' => 'required|string',
            'nature_of_business' => 'nullable|string',
            'no_of_employees' => 'nullable|string',
            'annual_turnover' => 'nullable|string',
            'social_media_url' => 'nullable|url', // changed back to standard url if needed
            'hq_country' => 'nullable|string',
            'hq_city' => 'nullable|string',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
        ]);

        $updateData = [
            'company_name' => $request->company_name,
            'website' => $request->website,
            'sector' => $request->sector,
            'org_type' => $request->org_type,
            'postal_address' => $request->postal_address,
            'nature_of_business' => $request->nature_of_business,
            'no_of_employees' => $request->no_of_employees,
            'annual_turnover' => $request->annual_turnover,
            'social_media_url' => $request->social_media_url,
            'hq_country' => $request->hq_country,
            'hq_city' => $request->hq_city,
            'description' => $request->description,
            'is_profile_complete' => true,
        ];

        if ($request->has('industry_tags')) {
            $tags = $request->industry_tags;
            if (is_string($tags)) {
                $tags = json_decode($tags, true);
            }
            $updateData['industry_tags'] = $tags;
        }

        if ($request->hasFile('logo')) {
            $updateData['logo_path'] = $request->file('logo')->store('company_logos', 'public');
        }

        $company->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Company profile updated successfully.',
            'data' => $company
        ]);
    }
}
