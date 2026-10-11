import { useState } from 'react';
import ModuleLayout from '../../components/module/ModuleLayout';
import AiForm from '../../components/module/AiForm';
import TaskResult from '../../components/module/TaskResult';

export default function Medication() {
  const [task, setTask] = useState(null);

  const fields = [
    {
      name: 'medications',
      label: 'Medications',
      hint: 'Comma-separated list',
      type: 'tags',
      required: true,
      placeholder: 'e.g. Warfarin, Aspirin, Ibuprofen, Omeprazole',
    },
  ];

  // Convert comma-separated string into an array before sending
  const transform = (data) => ({
    medications: data.medications
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean),
  });

  return (
    <ModuleLayout
      title="Medication Interaction Checker"
      subtitle="Enter the patient's medications. AI analyzes pairwise interactions, rates risk, and recommends actions."
      accent="#ef4444"
    >
      {!task ? (
        <AiForm
          type="medication-check"
          fields={fields}
          submitLabel="Check Interactions"
          onResult={setTask}
          transform={transform}
        />
      ) : (
        <TaskResult task={task} onReset={() => setTask(null)} />
      )}
    </ModuleLayout>
  );
}