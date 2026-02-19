import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepDefinition {
  label: string;
  icon: LucideIcon;
}

interface StepperProps {
  steps: StepDefinition[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label="Progreso" className="w-full overflow-x-auto py-4">
      <ol className="flex items-start justify-center gap-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFuture = index > currentStep;
          const isLast = index === steps.length - 1;
          const Icon = step.icon;

          return (
            <li
              key={step.label}
              className="flex items-start"
            >
              {/* Step circle + label */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted &&
                      "border-[#2A9D8F] bg-[#2A9D8F] text-white",
                    isCurrent &&
                      "border-[#2A9D8F] bg-white text-[#2A9D8F] ring-2 ring-[#2A9D8F]/30 ring-offset-1",
                    isFuture &&
                      "border-gray-300 bg-white text-gray-400",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" strokeWidth={2.5} />
                  ) : (
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  )}
                </div>

                <span
                  className={cn(
                    "mt-2 max-w-[5.5rem] text-center text-xs leading-tight",
                    isCompleted && "font-medium text-[#2A9D8F]",
                    isCurrent && "font-semibold text-[#1B4332]",
                    isFuture && "font-normal text-gray-400",
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "mt-5 h-0.5 w-10 shrink-0 sm:w-14 lg:w-20",
                    index < currentStep ? "bg-[#2A9D8F]" : "bg-gray-300",
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
