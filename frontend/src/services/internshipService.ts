import { apiFetch } from "./api";
import type { ApiResponse } from "@/types";

export interface Internship {
  id: string;
  company_name: string;
  domain: string;
  duration: string;
  description: string;
}


// Local static fallbacks
const fallbackInternships: Internship[] = [
  { id: "intern-1", company_name: "TCS iON", domain: "Software Engineering", duration: "3 Months", description: "Industry virtual internships focusing on Java development, software testing methodologies, and agile project execution." },
  { id: "intern-2", company_name: "AWS Academy", domain: "Cloud Computing", duration: "6 Months", description: "Cloud architecture internships covering AWS services, VPC designs, cloud security configurations, and serverless compute pipelines." },
  { id: "intern-3", company_name: "Verzeo AI", domain: "Machine Learning", duration: "3 Months", description: "Machine learning project internships covering predictive data analytics, regression modeling, and computer vision algorithms." },
  { id: "intern-4", company_name: "DRDO", domain: "Defense Research", duration: "6 Months", description: "Government research internships allowing students to collaborate on embedded systems and telemetry data processing models." }
];


export const internshipService = {
  getInternships: () => apiFetch("/api/v1/internships", fallbackInternships),
};
