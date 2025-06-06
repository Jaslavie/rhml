import {
  DecisionContext,
  MachineConfidence,
  CostConfiguration,
  AllocationDecision,
  DecisionActor,
} from "./types";

/**
 * Logic-Based Decision Allocator
 * allocated decision-making power based on defined policies
 *
 * Implements the core allocation policy from Te'eni et al. (2023)
 *
 * Core Formulas:
 * U_human = P_correct,human - C_human
 * U_machine = P_correct,machine - C_machine
 *
 * Allocation Rule: argmax(U_human, U_machine)
 */
export class LogicBasedAllocator {
  private costConfig: CostConfiguration;
  private humanPerformanceHistory: Map<string, number[]> = new Map();
  private machinePerformanceHistory: Map<string, number[]> = new Map();
  constructor(costConfig: CostConfiguration) {
    this.costConfig = costConfig;
  }

  //* ===== DRIVER FUNCTION: core allocation logic using utility-based arbitration =====
  allocateDecision(
    context: DecisionContext,
    machineConfidence: MachineConfidence,
    humanExpertise: number = 0.8 // Default human domain expertise (0-1)
  ): AllocationDecision {
    // stores reasoning for the decision (based on numbers for now)
    const reasoning: string[] = [];

    //* ===== utility calculations =====
    // executes the utility functions
    const { U_machine, P_correct_machine } = this.calculateMachineUtility(
      context,
      machineConfidence,
      reasoning
    );
    const { U_human, P_correct_human } = this.calculateHumanUtility(
      context,
      humanExpertise,
      machineConfidence,
      reasoning
    );
    const { selectedActor, confidence } = this.decideAllocation(
      U_human,
      U_machine,
      P_correct_human,
      P_correct_machine,
      machineConfidence,
      context,
      reasoning
    );

    // Return AllocationDecision interface
    const allocationDecision: AllocationDecision = {
      actor: selectedActor,
      confidence: confidence,
      reasoning: reasoning,
      fallbackActor: selectedActor === "human" ? "machine" : "human",
    };

    return allocationDecision;
  }

  updatePerformanceHistory(
    context: DecisionContext,
    actualActor: DecisionActor,
    wasCorrect: boolean
  ) {
    return;
  }

  getPerformanceStats() {
    return;
  }

  //* ===== HELPER FUNCTIONS =====
  //====== utility calculations =====
  // Calculate machine utility: U_machine = P_correct,machine - C_machine
  private calculateMachineUtility(
    context: DecisionContext,
    machineConfidence: MachineConfidence,
    reasoning: string[] // insert empty array. the program will append the reasoning to the list.
  ) {
    const P_correct_machine = this.estimateMachineAccuracy(
      context,
      machineConfidence
    );
    const C_machine = this.calculateMachineCost(context);
    const U_machine = P_correct_machine - C_machine;

    reasoning.push(
      `Machine utility: P_correct=${P_correct_machine.toFixed(3)}, Cost=${C_machine.toFixed(3)}, U=${U_machine.toFixed(3)}`
    );

    return { U_machine, P_correct_machine };
  }
  // Calculate human utility: U_human = P_correct,human - C_human
  private calculateHumanUtility(
    context: DecisionContext,
    humanExpertise: number,
    machineConfidence: MachineConfidence,
    reasoning: string[]
  ) {
    const P_correct_human = this.estimateHumanAccuracy(
      context,
      humanExpertise,
      machineConfidence
    );
    const C_human = this.calculateHumanCost(context);
    const U_human = P_correct_human - C_human;

    reasoning.push(
      `Human utility: P_correct=${P_correct_human.toFixed(3)}, Cost=${C_human.toFixed(3)}, U=${U_human.toFixed(3)}`
    );

    return { U_human, P_correct_human };
  }

  //====== master decision function =====
  private decideAllocation(
    U_human: number,
    U_machine: number,
    P_correct_human: number,
    P_correct_machine: number,
    machineConfidence: MachineConfidence,
    context: DecisionContext,
    reasoning: string[]
  ) {
    // default to human and 0 confidence
    let selectedActor: DecisionActor = "human";
    let confidence: number = 0;

    //* ===== rules to assign actor =====
    // CORE ALLOCATION RULE: argmax(U_human, U_machine)
    if (U_human > U_machine) {
      selectedActor = "human";
      confidence = P_correct_human;
      reasoning.push(
        "CREW OPTIMAL: Human performance exceeds AI capability for this task"
      );
    }
    if (U_machine > U_human) {
      selectedActor = "machine";
      confidence = P_correct_machine;
      reasoning.push(
        "AUTO OPTIMAL: AI performance exceeds crew capability for this task"
      );
    }

    // if machine is confident and uncertainty is low
    if (
      machineConfidence.confidenceScore > 0.8 &&
      machineConfidence.uncertaintyScore < 0.2
    ) {
      selectedActor = "machine";
      confidence = P_correct_machine;
      reasoning.push(
        "AUTO CLEARED: High confidence, low risk - AI execution authorized"
      );
    }
    // When machine is uncertain, humans excel at handling edge cases
    if (machineConfidence.uncertaintyScore > 0.3) {
      selectedActor = "human";
      confidence = P_correct_human;
      reasoning.push(
        "CREW REQUIRED: AI uncertainty detected - human judgment needed"
      );
    }
    // if confidence is gray zone, use hybrid decision model
    // TODO: needs to be expanded upon
    if (
      machineConfidence.confidenceScore >= 0.5 &&
      machineConfidence.confidenceScore <= 0.8
    ) {
      selectedActor = "human";
      confidence = P_correct_human;
      reasoning.push(
        "CREW STANDBY: Moderate confidence - human oversight recommended"
      );
    }
    // if the task is an emergency and the machine is uncertain
    // always defer to human
    if (
      context.taskType === "emergency" &&
      machineConfidence.uncertaintyScore > 0.5
    ) {
      selectedActor = "human";
      confidence = P_correct_human;
      reasoning.push(
        "EMERGENCY OVERRIDE: Critical situation - crew takes control immediately"
      );
    }

    return { selectedActor, confidence, reasoning };
  }

  //====== accuracy calculations =====
  private estimateMachineAccuracy(
    context: DecisionContext,
    machineConfidence: MachineConfidence
  ): number {
    return 0;
  }
  private estimateHumanAccuracy(
    context: DecisionContext,
    humanExpertise: number,
    machineConfidence: MachineConfidence
  ): number {
    return 0;
  }

  //====== cost calculations =====
  private calculateMachineCost(context: DecisionContext): number {
    // Machine costs are generally very low (computational efficiency)
    let cost = 0.01; // Base computational cost

    // EMERGENCY COST INCREASE: Higher stakes increase effective cost
    // In emergencies, potential error costs are amplified
    if (context.taskType === "emergency") { cost += 0.05; }

    return cost;
  }

  private calculateHumanCost(context: DecisionContext): number {
    // Human costs include time, cognitive effort, and opportunity cost
    let cost = 0.1; // Base human effort cost

    // TASK COMPLEXITY ADJUSTMENTS
    // Different tasks require different cognitive loads
    if (context.taskType === "routine") {
      cost = 0.05; // Lower cost for routine tasks (less cognitive load)
    } else if (context.taskType === "planning") {
      cost = 0.15; // Higher cost for complex planning (more cognitive effort)
    }
    // emergency tasks keeps the base cost

    return cost;
  }
}
