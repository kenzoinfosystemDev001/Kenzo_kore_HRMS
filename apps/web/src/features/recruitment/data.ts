export const recruitmentStats = {
  openPositions: 0,
  totalCandidates: 0,
  interviewsScheduled: 0,
  offersMade: 0
};

export const jobRequisitions: { id: string; title: string; department: string; type: string; location: string; applicants: number; status: string }[] = [];

export const candidatesPipeline = {
  applied: [] as { id: string; name: string; role: string; experience: string; rating: number }[],
  screening: [] as { id: string; name: string; role: string; experience: string; rating: number }[],
  interview: [] as { id: string; name: string; role: string; experience: string; rating: number }[],
  offered: [] as { id: string; name: string; role: string; experience: string; rating: number }[],
  hired: [] as { id: string; name: string; role: string; experience: string; rating: number }[],
};
