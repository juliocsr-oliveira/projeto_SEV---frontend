// utils/buildValidationSession.ts
export function buildValidationSession(data, user): ValidationSession {
  return {
    id: data.id,
    user: user.name,
    department: user.department,
    division: data.division || '',
    system: data.system || '',
    environment: data.environment || '',
    startTime: new Date(),
    items: (data.test_cases || []).map((tc: any) => ({
      id: tc.id,
      item: tc.title,
      status: '',
      evidence: null,
      evidencePreview: null,
      comment: ''
    })),
    status: 'em_andamento',
    structureVersion: data.structure_version || '2.1.0',
    validationName: data.name,
    validationType: data.validation_type,
    responsible: data.responsible_name,
    validationStatus: data.status,
  };
}