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
    // TODO: replace this with logic
    const selectedActor: DecisionActor = "human";
    const confidence: number = 0;
    return { selectedActor, confidence };
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
    return 0;
  }
  private calculateHumanCost(context: DecisionContext): number {
    return 0;
  }
}
