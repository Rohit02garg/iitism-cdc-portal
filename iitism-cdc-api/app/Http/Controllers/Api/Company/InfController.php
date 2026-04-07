<?php

namespace App\Http\Controllers\Api\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JobNotificationForm;
use App\Models\JnfJobProfile;
use App\Models\JnfEligibility;
use App\Models\JnfSalary;
use App\Models\JnfSelectionProcess;
use App\Models\JnfDeclaration;
use App\Models\FormAuditLog;
use Illuminate\Support\Facades\Mail;
use App\Mail\FormSubmittedConfirmation;
use App\Mail\AdminFormSubmittedAlert;

class InfController extends Controller
{
    public function create(Request $request)
    {
        $company = $request->user()->company;
        
        $inf = JobNotificationForm::create([
            'company_id' => $company->id,
            'season' => '2024-25',
            'form_type' => 'INF',
            'status' => 'draft',
        ]);
        
        return response()->json([
            'success' => true, 
            'data' => [
                'id' => $inf->id, 
                'status' => 'draft'
            ]
        ]);
    }

    public function show($id, Request $request)
    {
        $inf = JobNotificationForm::with([
            'company', 
            'jobProfile', 
            'eligibility', 
            'salary', 
            'selectionProcess', 
            'declaration',
            'auditLogs'
        ])->where('id', $id)
          ->where('company_id', $request->user()->company->id)
          ->firstOrFail();

        // Attach contacts from raw table
        $contacts = \DB::table('jnf_contacts')->where('jnf_id', $inf->id)->first();
        $infData = $inf->toArray();
        $infData['contacts'] = $contacts ? json_decode($contacts->data, true) : null;

        return response()->json([
            'success' => true,
            'data' => $infData
        ]);
    }

    public function saveDraft($id, Request $request)
    {
        $inf = JobNotificationForm::where('id', $id)
            ->where('company_id', $request->user()->company->id)
            ->firstOrFail();
            
        if ($inf->status !== 'draft') {
            return response()->json(['success' => false, 'message' => 'Only draft forms can be edited'], 403);
        }

        $section = $request->section;
        $data = $request->data;

        switch ($section) {
            case 'season':
                $inf->update(['season' => $data['season'] ?? '2024-25']);
                break;
            case 'job_profile':
                $mappedData = [
                    'job_title' => $data['profile_name'] ?? '',
                    'designation' => $data['designation'] ?? '',
                    'place_of_posting' => $data['place_of_posting'] ?? '',
                    'work_mode' => $data['work_mode'] ?? null,
                    'tentative_joining' => $data['tentative_joining'] ?? null,
                    'expected_hires' => (isset($data['expected_hires']) && is_numeric($data['expected_hires'])) ? (int)$data['expected_hires'] : 0,
                    'min_hires' => (isset($data['min_hires']) && is_numeric($data['min_hires'])) ? (int)$data['min_hires'] : null,
                    'skills' => $data['skills'] ?? [],
                    'jd_text' => $data['job_description'] ?? '',
                    'jd_pdf_path' => $data['jd_pdf_path'] ?? null,
                    'ppo_provision' => (bool)($data['ppo_provision'] ?? false),
                    'registration_link' => $data['registration_link'] ?? null,
                    'additional_info' => $data['additional_info'] ?? null,
                    'bond_details' => $data['bond_details'] ?? null,
                    'onboarding_procedure' => $data['onboarding_procedure'] ?? null,
                ];
                JnfJobProfile::updateOrCreate(['jnf_id' => $inf->id], $mappedData);
                break;
            case 'eligibility':
                $genderMap = [
                    'all genders' => 'all',
                    'male only' => 'male',
                    'female only' => 'female',
                    'others only' => 'other',
                ];
                $mappedGender = $genderMap[strtolower($data['gender_filter'] ?? '')] ?? 'all';

                $mappedData = [
                    'programmes' => $data['courses'] ?? [],
                    'min_cgpa' => (isset($data['min_cgpa']) && is_numeric($data['min_cgpa'])) ? (float)$data['min_cgpa'] : null,
                    'backlogs_allowed' => ($data['backlogs_allowed'] ?? 'No') === 'Yes',
                    'highschool_percent' => (isset($data['high_school_percentage']) && is_numeric($data['high_school_percentage'])) ? (float)$data['high_school_percentage'] : null,
                    'gender_filter' => $mappedGender,
                    'per_discipline_cgpa' => $data['per_discipline_cgpa'] ?? [],
                    'special_requirements' => $data['special_requirements'] ?? null,
                ];
                JnfEligibility::updateOrCreate(['jnf_id' => $inf->id], $mappedData);
                break;
            case 'salary':
                $mappedData = [
                    'currency' => $data['currency'] ?? 'INR',
                    'salary_same_for_all' => (bool)($data['same_for_all'] ?? true),
                    'salary_data' => $data['stipends'] ?? [],
                    'additional_components' => [
                        'perks' => $data['perks'] ?? null,
                        'same_additional_for_all' => (bool)($data['same_additional_for_all'] ?? true),
                    ],
                ];
                JnfSalary::updateOrCreate(['jnf_id' => $inf->id], $mappedData);
                break;
            case 'selection_process':
                $mappedData = [
                    'stages' => [
                        'ppt' => $data['ppt'] ?? null,
                        'resume_shortlisting' => $data['resume_shortlisting'] ?? null,
                        'test' => $data['test'] ?? null,
                        'group_discussion' => $data['group_discussion'] ?? null,
                        'interview' => $data['interview'] ?? null,
                    ],
                    'infrastructure_required' => [
                        'visit_team_size' => $data['visit_team_size'] ?? '',
                        'rooms_required' => $data['rooms_required'] ?? '',
                        'special_infrastructure' => $data['special_infrastructure'] ?? '',
                    ],
                    'psychometric_test' => (bool)($data['psychometric_test'] ?? false),
                    'psychometric_test_details' => $data['psychometric_test_details'] ?? '',
                    'medical_test' => (bool)($data['medical_test'] ?? false),
                    'medical_test_details' => $data['medical_test_details'] ?? '',
                    'other_screening' => (bool)($data['other_screening'] ?? false),
                    'other_screening_details' => $data['other_screening_details'] ?? '',
                ];
                JnfSelectionProcess::updateOrCreate(['jnf_id' => $inf->id], $mappedData);
                break;
            case 'declaration':
                $mappedData = [
                    'aipc_agreed' => (bool)($data['agree_aipc'] ?? false),
                    'shortlisting_agreed' => (bool)($data['agree_shortlisting_timeline'] ?? false),
                    'info_verified' => (bool)($data['agree_correct_info'] ?? false),
                    'ranking_consent' => (bool)($data['consent_share_data_media'] ?? false),
                    'accuracy_confirmed' => (bool)($data['agree_terms_conditions'] ?? false),
                    'rti_nirf_consent' => (bool)($data['consent_rti_nirf'] ?? false),
                    'signatory_name' => $data['signatory_name'] ?? '',
                    'signatory_designation' => $data['signatory_designation'] ?? '',
                    'signatory_date' => $data['signature_date'] ?? null,
                    'typed_signature' => $data['typed_signature'] ?? '',
                ];
                JnfDeclaration::updateOrCreate(['jnf_id' => $inf->id], $mappedData);
                break;
            case 'contacts':
                \DB::table('jnf_contacts')->updateOrInsert(
                    ['jnf_id' => $inf->id],
                    ['data' => json_encode($data), 'updated_at' => now(), 'created_at' => now()]
                );
                break;
        }

        return response()->json([
            'success' => true,
            'message' => 'Draft saved'
        ]);
    }

    public function submit($id, Request $request)
    {
        $inf = JobNotificationForm::with(['jobProfile', 'eligibility', 'salary', 'selectionProcess', 'declaration'])
            ->where('id', $id)
            ->where('company_id', $request->user()->company->id)
            ->firstOrFail();

        // Deep validation checks
        $errors = [];

        // 1. Contacts Check
        $contactsData = \DB::table('jnf_contacts')->where('jnf_id', $inf->id)->first();
        if (!$contactsData) {
            $errors[] = 'Contact details are missing.';
        }

        // 2. Job Profile
        if (!$inf->jobProfile || empty($inf->jobProfile->job_title) || empty($inf->jobProfile->place_of_posting) || empty($inf->jobProfile->expected_hires)) {
            $errors[] = 'Job Profile is incomplete.';
        }

        // 3. Eligibility
        if (!$inf->eligibility || is_null($inf->eligibility->min_cgpa) || empty($inf->eligibility->programmes) || count($inf->eligibility->programmes) == 0) {
            $errors[] = 'Eligibility details are incomplete or no courses selected.';
        }

        // 4. Salary/Stipend
        if (!$inf->salary || empty($inf->salary->salary_data) || count($inf->salary->salary_data) == 0) {
            $errors[] = 'Stipend details are incomplete.';
        } else {
            $stipends = collect($inf->salary->salary_data);
            $hasStipend = $stipends->contains(function ($s) {
                return !empty($s['base']) && $s['base'] > 0;
            });
            if (!$hasStipend) {
                $errors[] = 'Stipend details must have a base amount defined for at least one programme.';
            }
        }

        // 5. Selection Process
        if (!$inf->selectionProcess || empty($inf->selectionProcess->stages)) {
            $errors[] = 'Selection Process is missing.';
        } else {
            $stages = $inf->selectionProcess->stages;
            $hasStage = false;
            $fields = ['ppt', 'resume_shortlisting', 'test', 'group_discussion', 'interview'];
            foreach ($fields as $f) {
                if (!empty($stages[$f]['enabled'])) {
                    $hasStage = true;
                    if (empty($stages[$f]['rounds']) || empty($stages[$f]['rounds'][0]['mode'])) {
                         $errors[] = "Selection Process: " . strtoupper($f) . " is enabled but mode or round details are missing.";
                    }
                }
            }
            if (!$hasStage) {
                $errors[] = 'Selection Process must have at least one stage enabled.';
            }
        }

        // 6. Declaration
        if (!$inf->declaration || empty($inf->declaration->signatory_name) || empty($inf->declaration->typed_signature)) {
            $errors[] = 'Declaration is incomplete or missing signatory.';
        }

        if (count($errors) > 0) {
            return response()->json([
                'success' => false, 
                'message' => 'Cannot submit INF. Missing fields: ' . implode(" ", $errors)
            ], 400);
        }

        $inf->update([
            'status' => 'submitted',
            'submitted_at' => now()
        ]);

        FormAuditLog::create([
            'jnf_id' => $inf->id,
            'action' => 'submitted',
            'performed_by' => $request->user()->id
        ]);

        if (class_exists(FormSubmittedConfirmation::class)) {
            Mail::to($request->user()->email)->queue(new FormSubmittedConfirmation($inf));
        }

        if (class_exists(AdminFormSubmittedAlert::class)) {
            Mail::to('admin@iitism.ac.in')->queue(new AdminFormSubmittedAlert($inf));
        }

        return response()->json([
            'success' => true,
            'message' => 'INF submitted successfully!'
        ]);
    }
}
