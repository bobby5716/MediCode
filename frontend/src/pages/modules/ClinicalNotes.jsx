import { useState } from 'react';
import ModuleLayout from '../../components/module/ModuleLayout';
import AiForm from '../../components/module/AiForm';
import TaskResult from '../../components/module/TaskResult';

export default function ClinicalNotes() {
  const [task, setTask] = useState(null);

  const fields = [
    {
      name: 'noteText',
      label: 'Raw Visit Note',
      type: 'textarea',
      rows: 10,
      required: true,
      placeholder:
        'Paste the doctor\'s raw visit note here, e.g. "45yo male presents with 3 days of productive cough, low-grade fever..."',
    },
  ];

  return (
    <ModuleLayout
      title="Clinical Note Summarizer"
      subtitle="Paste a doctor's raw note. AI extracts summary, symptoms, diagnosis, prescriptions, and ICD-10 codes."
      accent="#8b5cf6"
    >
      {!task ? (
        <AiForm
          type="clinical-note"
          fields={fields}
          submitLabel="Summarize Note"
          onResult={setTask}
        />
      ) : (
        <TaskResult task={task} onReset={() => setTask(null)} />
      )}
    </ModuleLayout>
  );
}