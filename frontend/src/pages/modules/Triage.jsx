import { useState } from 'react';
import ModuleLayout from '../../components/module/ModuleLayout';
import AiForm from '../../components/module/AiForm';
import TaskResult from '../../components/module/TaskResult';

export default function Triage() {
  const [task, setTask] = useState(null);

  const fields = [
    {
      name: 'age',
      label: 'Patient Age',
      type: 'number',
      required: true,
      placeholder: 'e.g. 45',
    },
    {
      name: 'symptoms',
      label: 'Primary Symptoms',
      type: 'textarea',
      rows: 4,
      required: true,
      placeholder: 'e.g. Severe chest pain radiating to left arm, shortness of breath, sweating',
    },
    {
      name: 'duration',
      label: 'Duration',
      required: true,
      placeholder: 'e.g. 30 minutes',
    },
    {
      name: 'vitals',
      label: 'Vitals (optional)',
      hint: 'BP / HR / SpO2 / Temp',
      placeholder: 'e.g. BP 150/95, HR 110, SpO2 94%, Temp 98.6F',
    },
  ];

  return (
    <ModuleLayout
      title="Smart Triage"
      subtitle="Enter patient data. AI classifies urgency (1–5), flags red flags, and recommends next action."
      accent="#f97316"
    >
      {!task ? (
        <AiForm
          type="triage"
          fields={fields}
          submitLabel="Triage Patient"
          onResult={setTask}
        />
      ) : (
        <TaskResult task={task} onReset={() => setTask(null)} />
      )}
    </ModuleLayout>
  );
}