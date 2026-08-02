import { apiFetch } from "./api";
import type { ApiResponse } from "@/types";

export interface Alumni {
  id: string;
  name: string;
  graduation_year: number;
  department: string;
  company: string;
  role: string;
  achievement: string;
  image_url: string;
}


// Local static fallbacks
const fallbackAlumni: Alumni[] = [
  {
    id: "al-1",
    name: "Siddharth Verma",
    graduation_year: 2021,
    department: "Computer Science Engineering",
    company: "Microsoft",
    role: "Software Engineer",
    achievement: "Led development of cloud storage optimization sub-modules within the Azure infrastructure wing.",
    image_url: "/images/alumni/success-story.webp"
  },
  {
    id: "al-2",
    name: "Ananya Hegde",
    graduation_year: 2022,
    department: "Artificial Intelligence & Data Science",
    company: "Amazon",
    role: "Data Scientist",
    achievement: "Built predictive product recommendation models scaling up conversion rates in Amazon retail systems by 8%.",
    image_url: "/images/alumni/career-growth.webp"
  },
  {
    id: "al-3",
    name: "Rahul Nair",
    graduation_year: 2020,
    department: "Electronics & Communication Engineering",
    company: "Qualcomm",
    role: "VLSI Design Engineer",
    achievement: "Contributed to circuit validation testing loops for Snapdragon 5G baseband processing modules.",
    image_url: "/images/alumni/success-story.webp"
  }
];


export const alumniService = {
  getAlumni: () => apiFetch("/api/v1/alumni", fallbackAlumni),
};
