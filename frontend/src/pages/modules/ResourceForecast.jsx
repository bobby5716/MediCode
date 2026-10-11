import { useState } from 'react';
import ModuleLayout from '../../components/module/ModuleLayout';
import AiForm from '../../components/module/AiForm';
import TaskResult from '../../components/module/TaskResult';

export default function ResourceForecast() {
  const [task, setTask] = useState(null);

  const fields = [
    {
      name: 'department',
      label: 'Department',
      required: true,
      placeholder: 'e.g. Emergency, ICU, Pediatrics',
    },
    {
      name: 'currentLoad',
      label: 'Current Load',
      placeholder: 'e.g. 42 patients, 8 beds available',
    },
    {
      name: 'historicalData',
      label: 'Historical Admissions (last 7 days)',
      type: 'textarea',
      rows: 4,
      required: true,
      placeholder: 'e.g. Mon: 34, Tue: 41, Wed: 38, Thu: 45, Fri: 52, Sat: 61, Sun: 48',
    },
  ];

  return (
    <ModuleLayout
      title="Resource Forecast"
      subtitle="Provide recent admission data. AI forecasts next week's demand and recommends staffing."
      accent="#22c55e"
    >
      {!task ? (
        <AiForm
          type="resource-forecast"
          fields={fields}
          submitLabel="Generate Forecast"
          onResult={setTask}
        />
      ) : (
        <TaskResult task={task} onReset={() => setTask(null)} />
      )}
    </ModuleLayout>
  );
}