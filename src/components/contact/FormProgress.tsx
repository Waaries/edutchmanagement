
import { Progress } from "@/components/ui/progress";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const FormProgress = ({ currentStep, totalSteps, className }: FormProgressProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm text-slate-600">
        <span>Voortgang</span>
        <span>{currentStep} van {totalSteps} velden ingevuld</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default FormProgress;
