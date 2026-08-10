"use client"

export type SystemAccessRole = "Employee" | "Super_admin" | "Admin" | "HR"

export interface UploadedDocRecord {
  fileName: string
  fileUrl: string
  uploadedAt: string
  status: "Uploaded" | "Verified" | "Rejected"
}

export interface EmployeeRecord {
  id: string
  name: string
  email: string
  password?: string
  role: string
  systemRole?: SystemAccessRole
  dept: string
  status: string
  joinDate: string
  avatarUrl?: string
  phone?: string
  address?: string
  permanentAddress?: string
  emergencyPhone?: string
  personalEmail?: string
  govtIdType?: string
  govtIdValue?: string
  maritalStatus?: string
  dependentNominee?: string
  dependentNomineeDob?: string
  qualification?: string
  scoreCard?: string
  medicalIssues?: string
  medication?: string
  medicalHistory?: string
  documents?: string
  uploadedDocuments?: Record<string, UploadedDocRecord>
}

export interface VerificationDocSpec {
  id: string
  title: string
  mandatory: boolean
  description: string
}

export const VERIFICATION_DOCUMENTS_LIST: VerificationDocSpec[] = [
  { id: "aadhaar_card", title: "Aadhaar Card (Original + Photocopy)", mandatory: true, description: "Clear front & back copy of Govt Aadhaar ID" },
  { id: "pan_card", title: "PAN Card (Original + Photocopy)", mandatory: true, description: "Official Income Tax PAN Card copy" },
  { id: "perm_address_proof", title: "Permanent Address Proof", mandatory: true, description: "Passport, Electricity Bill, Voter ID, or Driving License" },
  { id: "temp_address_proof", title: "Current/Temporary Address Proof", mandatory: false, description: "Rent agreement or utility bill (if different from permanent address)" },
  { id: "class_10th_cert", title: "Class 10th Mark Sheet/Certificate", mandatory: true, description: "SSLC / Secondary School Board Certificate" },
  { id: "class_12th_cert", title: "Class 12th Mark Sheet/Certificate", mandatory: true, description: "HSC / Senior Secondary School Certificate" },
  { id: "grad_marksheet", title: "Graduation Mark Sheets (all years/semesters)", mandatory: true, description: "All semester/yearly mark sheets" },
  { id: "grad_degree", title: "Graduation Degree Certificate", mandatory: false, description: "Final Degree or Provisional Certificate (if available)" },
  { id: "passport_photos", title: "Two recent passport-size photographs", mandatory: false, description: "Recent passport photos with white background" },
  { id: "cancelled_cheque", title: "Cancelled Cheque / Bank Passbook", mandatory: false, description: "Showing Account Holder Name, Account #, and IFSC Code" },
  { id: "offer_letters", title: "Offer Letter(s) from previous employer(s)", mandatory: false, description: "Official appointment/offer letters" },
  { id: "experience_letters", title: "Experience Letter(s) from previous employer(s)", mandatory: false, description: "Official work experience letters" },
  { id: "relieving_letter", title: "Relieving Letter from previous employer", mandatory: false, description: "Formal relieving letter from last company" },
  { id: "salary_slips", title: "Last 3 Salary Slips", mandatory: false, description: "Payslips for previous 3 consecutive months" },
  { id: "updated_resume", title: "Updated Resume", mandatory: false, description: "Latest CV/Resume in PDF/DOCX format" },
]

const STORAGE_KEY = "kenzo_hrms_employees_store"

export const DEFAULT_EMPLOYEES: EmployeeRecord[] = [
  {
    id: "EMP-1001",
    name: "Ankit Sethi",
    email: "Ankit.sethi@kenzoinfosystems.com",
    password: "kenzo123",
    role: "CEO & Founder",
    systemRole: "Super_admin",
    dept: "Management",
    status: "Active",
    joinDate: "Jan 01, 2020",
    phone: "+91 98100 12345",
    address: "Executive Suite 401, Tech Park, Noida",
    permanentAddress: "Sector 62, Noida, UP 201301",
    emergencyPhone: "+91 98100 99999",
    personalEmail: "ankit.sethi@example.com",
    govtIdType: "Aadhaar",
    govtIdValue: "4589 1234 5678",
    maritalStatus: "Married",
    dependentNominee: "Spouse",
    dependentNomineeDob: "1990-05-15",
    qualification: "MBA / B.Tech Computer Science",
    scoreCard: "Executive Rating (98/100)",
    medicalIssues: "None",
    medication: "None",
    medicalHistory: "Annual executive health checkup clear",
    documents: "Verified (Aadhaar, Passport, Qualification)",
    uploadedDocuments: {
      aadhaar_card: { fileName: "Aadhaar_AnkitSethi.pdf", fileUrl: "#", uploadedAt: "Jan 02, 2020", status: "Verified" },
      pan_card: { fileName: "PAN_AnkitSethi.pdf", fileUrl: "#", uploadedAt: "Jan 02, 2020", status: "Verified" },
    },
  },
  {
    id: "EMP-1002",
    name: "Sujal Kumar",
    email: "Sujal.kumar@kenzoinfosystems.com",
    password: "kenzo123",
    role: "Software Engineer",
    systemRole: "Employee",
    dept: "Engineering",
    status: "Active",
    joinDate: "Jan 15, 2024",
    phone: "6207210784",
    address: "A2 B59 Near Hanuman mandir phase 1 Aayanagar , New Delhi",
    permanentAddress: "DT-10 Dusadh Mhaulla , Chatti baazar Ramgarh cant ,Jharkhand",
    emergencyPhone: "9835123735",
    personalEmail: "sujalreal983@gmail.com",
    govtIdType: "Adhaar",
    govtIdValue: "591730412902",
    maritalStatus: "Single",
    dependentNominee: "Parent / Child Nominee",
    dependentNomineeDob: "2000-01-01",
    qualification: "B.Tech Computer Science",
    scoreCard: "Performance Rating (95/100)",
    medicalIssues: "None",
    medication: "None",
    medicalHistory: "Clean medical history notes",
    documents: "Verified (Adhaar ID, Technical Certifications, Degree)",
    uploadedDocuments: {
      aadhaar_card: { fileName: "Aadhaar_SujalKumar.pdf", fileUrl: "#", uploadedAt: "Jan 16, 2024", status: "Verified" },
      pan_card: { fileName: "PAN_SujalKumar.pdf", fileUrl: "#", uploadedAt: "Jan 16, 2024", status: "Verified" },
    },
  },
  {
    id: "EMP-1003",
    name: "Chanchal Saini",
    email: "Chanchal.saini@kenzoinfosystems.com",
    password: "kenzo123",
    role: "Managing Director",
    systemRole: "Admin",
    dept: "Administration",
    status: "Active",
    joinDate: "Aug 07, 2026",
    phone: "+91 98100 99887",
    address: "Mayur Vihar Phase 1, New Delhi",
    permanentAddress: "New Delhi 110091",
    govtIdType: "Aadhaar",
    govtIdValue: "8899 1122 3344",
  },
  {
    id: "EMP-1004",
    name: "Jitender Saini",
    email: "Jitender.saini@kenzoinfosystems.com",
    password: "kenzo123",
    role: "CEO",
    systemRole: "Super_admin",
    dept: "Administration",
    status: "Active",
    joinDate: "Aug 07, 2026",
    phone: "+91 98100 77665",
    address: "Mayur Vihar Phase 1, New Delhi",
    permanentAddress: "New Delhi 110091",
    govtIdType: "Aadhaar",
    govtIdValue: "7788 2233 4455",
  },
  {
    id: "EMP-1005",
    name: "Laxmi Narayan",
    email: "Laxminarayan.ojha@kenzoinfosystems.com",
    password: "kenzo123",
    role: "Field Sales Executive",
    systemRole: "Employee",
    dept: "Sales",
    status: "Active",
    joinDate: "Aug 06, 2026",
    phone: "+91 98100 33221",
    address: "Sector 18, Noida",
    permanentAddress: "Noida UP 201301",
    govtIdType: "Aadhaar",
    govtIdValue: "3344 5566 7788",
  },
]

export function getStoredEmployees(): EmployeeRecord[] {
  if (typeof window === "undefined") return DEFAULT_EMPLOYEES
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as EmployeeRecord[]
      if (parsed && parsed.length > 0 && parsed.some(e => e.email.toLowerCase() === "chanchal.saini@kenzoinfosystems.com")) return parsed
    }
  } catch {
    // Fallback
  }
  saveStoredEmployees(DEFAULT_EMPLOYEES)
  return DEFAULT_EMPLOYEES
}

export function saveStoredEmployees(list: EmployeeRecord[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Fallback
  }
}

export function addStoredEmployee(emp: EmployeeRecord) {
  const current = getStoredEmployees()
  const updated = [emp, ...current]
  saveStoredEmployees(updated)
  return updated
}

export function updateStoredEmployee(emp: EmployeeRecord, oldId?: string) {
  const current = getStoredEmployees()
  const updated = current.map(e => {
    if ((oldId && e.id === oldId) || e.id === emp.id || e.email.toLowerCase() === emp.email.toLowerCase()) {
      return { ...e, ...emp }
    }
    return e
  })
  saveStoredEmployees(updated)
  return updated
}

export function deleteStoredEmployee(id: string) {
  const current = getStoredEmployees()
  const updated = current.filter(e => e.id !== id)
  saveStoredEmployees(updated)
  return updated
}
