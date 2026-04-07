<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$jnf = App\Models\JobNotificationForm::with(['eligibility', 'salary', 'selectionProcess', 'declaration'])->find(14);
file_put_contents('jnf_14.json', json_encode($jnf->toArray(), JSON_PRETTY_PRINT));
