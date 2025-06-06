//* core inputs exchanged throughout the system
export interface DecisionContext {
  taskId: string;
  taskType: "classification" | "planning" | "emergency" | "routine";
  inputData: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface MachineConfidence {
  prediction: any;
  confidenceScore: number; // 0-1
  uncertaintyScore: number; // 0-1, higher = more uncertain
  modelVersion: string;
}

export interface CostConfiguration {
  falsePositiveCost: number;
  falseNegativeCost: number;
  timeDelayCost: number;
}

export type DecisionActor = "machine" | "human";

export interface AllocationDecision {
  actor: DecisionActor;
  confidence: number; // how confident we are in this allocation
  reasoning: string[];
  fallbackActor?: DecisionActor;
}

export interface DecisionResult {
  finalDecision: any;
  actualActor: DecisionActor;
  processingTime: number;
  humanOverride?: boolean;
  outcome?: "correct" | "incorrect" | "pending";
}
