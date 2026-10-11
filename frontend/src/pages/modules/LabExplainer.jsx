import { useState } from 'react';
import ModuleLayout from '../../components/module/ModuleLayout';
import AiForm from '../../components/module/AiForm';
import TaskResult from '../../components/module/TaskResult';

export default function LabExplainer() {
  const [task, setTask] = useState(null);

  const fields = [
    {
      name: 'reportText',
      label: 'Lab Report Text',
      type: 'textarea',
      rows: 10,
      required: true,
      placeholder:
        'Paste lab report values, e.g. "Hemoglobin: 11.2 g/dL (ref 13.5-17.5), WBC: 12,500 /μL (ref 4,000-11,000), Platelets: 245,000 /μL..."',
    },
  ];

  return (
    <ModuleLayout
      title="Lab Report Explainer"
      subtitle="Paste lab values. AI explains each metric in plain English and flags abnormal results."
      accent="#22d3ee"
    >
      {!task ? (
        <AiForm
          type="lab-explainer"
          fields={fields}
          submitLabel="Explain Report"
          onResult={setTask}
        />
      ) : (
        <TaskResult task={task} onReset={() => setTask(null)} />
      )}
    </ModuleLayout>
  );
}