export const recruitmentStats = {
  openPositions: 12,
  totalCandidates: 145,
  interviewsScheduled: 24,
  offersMade: 5
};

export const jobRequisitions = [
  { id: "req-1", title: "Senior Frontend Engineer", department: "Engineering", type: "Full-time", location: "San Francisco", applicants: 45, status: "Open" },
  { id: "req-2", title: "Product Marketing Manager", department: "Marketing", type: "Full-time", location: "Remote", applicants: 32, status: "Open" },
  { id: "req-3", title: "UX Designer", department: "Design", type: "Contract", location: "New York", applicants: 28, status: "Open" },
  { id: "req-4", title: "Backend Engineer", department: "Engineering", type: "Full-time", location: "San Francisco", applicants: 56, status: "On Hold" }
];

export const candidatesPipeline = {
  applied: [
    { id: "c-1", name: "Alice Smith", role: "Senior Frontend Engineer", experience: "5 yrs", rating: 4 },
    { id: "c-2", name: "Bob Johnson", role: "UX Designer", experience: "3 yrs", rating: 3 },
    { id: "c-3", name: "Charlie Davis", role: "Product Marketing", experience: "4 yrs", rating: 5 },
  ],
  screening: [
    { id: "c-4", name: "Diana Prince", role: "Senior Frontend Engineer", experience: "7 yrs", rating: 5 },
    { id: "c-5", name: "Evan Wright", role: "Backend Engineer", experience: "2 yrs", rating: 3 },
  ],
  interview: [
    { id: "c-6", name: "Fiona Gallagher", role: "Product Marketing", experience: "6 yrs", rating: 4 },
    { id: "c-7", name: "George Miller", role: "UX Designer", experience: "4 yrs", rating: 4 },
  ],
  offered: [
    { id: "c-8", name: "Hannah Abbott", role: "Senior Frontend Engineer", experience: "8 yrs", rating: 5 },
  ],
  hired: [
    { id: "c-9", name: "Ian Malcolm", role: "Backend Engineer", experience: "5 yrs", rating: 4 },
  ]
};
