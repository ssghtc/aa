// Utility functions for Client Needs categories

import { ClientNeedsCategory } from '@/types';

export const clientNeedsLabels: Record<ClientNeedsCategory, string> = {
    management_of_care: 'Management of Care',
    safety_infection_control: 'Safety and Infection Control',
    health_promotion_maintenance: 'Health Promotion and Maintenance',
    psychosocial_integrity: 'Psychosocial Integrity',
    basic_care_comfort: 'Basic Care and Comfort',
    pharmacological_parenteral_therapies: 'Pharmacological and Parenteral Therapies',
    reduction_risk_potential: 'Reduction of Risk Potential',
    physiological_adaptation: 'Physiological Adaptation',
    clinical_judgment: 'Clinical Judgment',
    recognize_cues: 'Recognize Cues',
    analyze_cues: 'Analyze Cues',
    prioritize_hypotheses: 'Prioritize Hypotheses',
    generate_solutions: 'Generate Solutions',
    take_actions: 'Take Actions',
    evaluate_outcomes: 'Evaluate Outcomes'
};

export const clientNeedsDescriptions: Record<ClientNeedsCategory, string> = {
    management_of_care: 'Provides and directs nursing care that enhances the care delivery setting to protect the client and health care personnel.',
    safety_infection_control: 'Protects clients and health care personnel from health and environmental hazards.',
    health_promotion_maintenance: 'Provides and directs nursing care of the client that incorporates knowledge of expected growth and development principles, prevention and/or early detection of health problems and strategies to achieve optimal health.',
    psychosocial_integrity: 'Provides and directs nursing care that promotes and supports the emotional, mental and social well-being of the client experiencing stressful events, as well as clients with acute or chronic mental illness.',
    basic_care_comfort: 'Provides comfort to clients and assistance in the performance of activities of daily living.',
    pharmacological_parenteral_therapies: 'Provides care related to the administration of medications and parenteral therapies.',
    reduction_risk_potential: 'Reduces the likelihood that clients will develop complications or health problems related to existing conditions, treatments or procedures.',
    physiological_adaptation: 'Manages and provides care for clients with acute, chronic or life-threatening physical health conditions.',
    clinical_judgment: 'The observed outcome of critical thinking and decision-making. It is an iterative process that uses nursing knowledge to observe and assess presenting situations, identify a prioritized client concern, and generate the best possible evidence-based solution in order to deliver safe client care.',
    recognize_cues: 'Identify relevant and important information from different sources (e.g., medical history, vital signs).',
    analyze_cues: 'Organizing and linking the recognized cues to the client\'s clinical presentation.',
    prioritize_hypotheses: 'Evaluating and ranking hypotheses according to priority (urgency, likelihood, risk, difficulty, time, etc.).',
    generate_solutions: 'Identifying expected outcomes and using hypotheses to define a set of interventions for the expected outcomes.',
    take_actions: 'Implementing the solution(s) that address(es) the highest priorities.',
    evaluate_outcomes: 'Comparing observed outcomes against expected outcomes.'
};

export function getClientNeedsLabel(category: ClientNeedsCategory | undefined): string {
    if (!category) return 'Not specified';
    return clientNeedsLabels[category] || category;
}

export function getClientNeedsDescription(category: ClientNeedsCategory | undefined): string {
    if (!category) return '';
    return clientNeedsDescriptions[category] || '';
}

export function getClientNeedsColor(category: ClientNeedsCategory | undefined): string {
    if (!category) return '#64748b';

    // Color coding by category group
    const colorMap: Record<string, string> = {
        // Client Needs Categories - Blue tones
        management_of_care: '#3b82f6',
        safety_infection_control: '#06b6d4',
        health_promotion_maintenance: '#10b981',
        psychosocial_integrity: '#8b5cf6',
        basic_care_comfort: '#ec4899',
        pharmacological_parenteral_therapies: '#f59e0b',
        reduction_risk_potential: '#ef4444',
        physiological_adaptation: '#14b8a6',

        // Clinical Judgment - Purple tones
        clinical_judgment: '#a855f7',
        recognize_cues: '#c084fc',
        analyze_cues: '#d8b4fe',
        prioritize_hypotheses: '#e9d5ff',
        generate_solutions: '#f3e8ff',
        take_actions: '#fae8ff',
        evaluate_outcomes: '#fdf4ff'
    };

    return colorMap[category] || '#64748b';
}
