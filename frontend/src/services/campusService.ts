import { apiFetch } from "./api";
import type { ApiResponse } from "@/types";

export interface CampusLocation {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url: string;
}

export interface Facility {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string;
  location: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description?: string;
}

export interface InfrastructureItem {
  id: string;
  title: string;
  description: string;
  facility_type: string;
  location: string;
  capacity?: number;
  features: string[];
  image_url: string;
  video_url?: string;
}

export interface LaboratoryItem {
  id: string;
  lab_name: string;
  department_id: string;
  description: string;
  equipment_details: string[];
  software_details: string[];
  capacity: number;
  image_url: string;
  video_url?: string;
}

export interface LibraryInfo {
  id: string;
  title: string;
  description: string;
  book_count: number;
  digital_resources: string[];
  seating_capacity: number;
  facilities: string[];
  image_url: string;
}

export interface HostelInfo {
  id: string;
  hostel_type: string;
  description: string;
  capacity: number;
  room_type: string;
  facilities: string[];
  mess_information: string[];
  security_features: string[];
  image_url: string;
}

export interface SportsItem {
  id: string;
  sport_name: string;
  description: string;
  facility_details: string[];
  image_url: string;
}

export interface ClubItem {
  id: string;
  club_name: string;
  category: string;
  description: string;
  activities: string[];
  image_url: string;
}

export interface CampusEventItem {
  id: string;
  event_name: string;
  description: string;
  event_date: string;
  category: string;
  image_url: string;
}


// Robust offline fallbacks
const fallbackLocations: CampusLocation[] = [
  { id: "entrance", name: "Main Entrance Gateway", description: "Welcoming entry arch featuring visitor parking lots, administrative checkpoints and landscaped reception greens.", latitude: 12, longitude: 20, image_url: "/images/campus/main-building.webp" },
  { id: "acad-block", name: "Academic Block A", description: "Multi-floor building housing high-grade smart classrooms, central faculty workspaces and seminar halls.", latitude: 35, longitude: 40, image_url: "/images/campus/academic-block.webp" }
];

const fallbackInfrastructure: InfrastructureItem[] = [
  {
    id: "inf-acad",
    title: "Academic Block A",
    description: "State-of-the-art academic wings comprising clean digital smart classrooms, central faculty workspaces and core engineering department hubs.",
    facility_type: "Academic Block",
    location: "Central Campus Area",
    capacity: 1500,
    features: ["Digital Smartboards", "Central Air Conditioning", "High-speed Wi-Fi", "Passenger Elevators"],
    image_url: "/images/campus/academic-block.webp"
  },
  {
    id: "inf-audi",
    title: "Sri Satya Seminar Auditorium",
    description: "A massive air-conditioned seminar and cultural hall equipped with professional acoustics panels, stage illumination systems, and greenrooms.",
    facility_type: "Auditorium",
    location: "Main Entrance West",
    capacity: 800,
    features: ["Acoustic wall linings", "Bose spatial sound system", "LED backdrop walls", "Stage greenrooms"],
    image_url: "/images/campus/main-building.webp"
  }
];

const fallbackLabs: LaboratoryItem[] = [
  {
    id: "lab-ai",
    lab_name: "AI Research Laboratory",
    department_id: "aids",
    description: "Cutting-edge computing lab hosting specialized servers to compile deep learning, computer vision, and big data models.",
    equipment_details: ["Intel Xeon GPU Servers", "Nvidia RTX Workstations"],
    software_details: ["TensorFlow GPU", "PyTorch Toolkit", "Jupyter Enterprise Server", "Apache Hadoop Spark"],
    capacity: 60,
    image_url: "/images/campus/computer-lab.png"
  },
  {
    id: "lab-prog",
    lab_name: "Programming Language Lab",
    department_id: "cse",
    description: "Core software lab housing setups to compile algorithms, web architectures, and advanced data structures.",
    equipment_details: ["Dell Multi-Core Developer Boxes", "CentOS File Repository server"],
    software_details: ["Java Development Kit", "Python Anaconda", "Eclipse & VS Code IDEs", "PostgreSQL database engines"],
    capacity: 60,
    image_url: "/images/student-life/coding.webp"
  }
];

const fallbackLibrary: LibraryInfo = {
  id: "lib-central",
  title: "Dr. A.P.J. Abdul Kalam Central Library",
  description: "A modern multi-level resource vault carrying thousands of textbook volumes, digital directories, journals and quiet study chambers.",
  book_count: 45000,
  digital_resources: ["IEEE Xplore full database", "Elsevier ScienceDirect access", "NPTEL Video lecture servers", "DELNET institutional membership"],
  seating_capacity: 300,
  facilities: ["Computer-aided reference logs", "Silent individual study cubes", "Reprographic & printing setups"],
  image_url: "/images/campus/library-interior.png"
};

const fallbackHostels: HostelInfo[] = [
  {
    id: "hostel-boys",
    hostel_type: "Boys Hostel",
    description: "Sri Satya Boys Residency provides clean, well-furnished rooms with expansive study yards and indoor recreational facilities.",
    capacity: 400,
    room_type: "Double & Triple Sharing Rooms",
    facilities: ["High-speed campus Wi-Fi access", "Hot water geysers and central laundry services", "Table tennis and TV recreational rooms"],
    mess_information: ["Nutritious vegetarian menus served 4 times daily", "Weekly special spreads and festival meals"],
    security_features: ["24/7 gate security guards", "Biometric check logs on entry/exit", "Resident wardens checking wings daily"],
    image_url: "/images/hostel/hostel-room.png"
  },
  {
    id: "hostel-girls",
    hostel_type: "Girls Hostel",
    description: "Sri Satya Girls Residency provides a secure, fully-monitored residential block with reading libraries and separate dining halls.",
    capacity: 300,
    room_type: "Double Sharing Rooms",
    facilities: ["High-speed campus Wi-Fi access", "In-house automatic laundry machinery", "Late-hour quiet study rooms"],
    mess_information: ["Hygienic vegetarian menus", "Purified RO drinking water system"],
    security_features: ["Female security guards at checkpoints", "Fingerprint login audit system", "High-walled perimeter fencing with CCTV control"],
    image_url: "/images/hostel/hostel-room.png"
  }
];

const fallbackSports: SportsItem[] = [
  {
    id: "sport-cricket",
    sport_name: "SSIET Cricket Oval & Turf",
    description: "A lush green matches ground equipped with practice nets, audience seating terraces, and floodlights.",
    facility_details: ["Match turf pitch", "Side practice nets", "Match lighting systems", "Sports gear kits"],
    image_url: "/images/campus/sports-ground.png"
  }
];

const fallbackClubs: ClubItem[] = [
  {
    id: "club-coding",
    club_name: "SSIET Developer Coding Forum",
    category: "Technical",
    description: "A student developer forum organizing weekly programming contests, AI seminars, and open source code hackathons.",
    activities: ["Weekly hackathons and mock coding tests", "Workshops on Git, Github, and Cloud systems", "Mentoring camps for GSOC and placements"],
    image_url: "/images/student-life/coding.webp"
  }
];

const fallbackEvents: CampusEventItem[] = [
  {
    id: "evt-hackathon",
    event_name: "National Software Hackathon 2026",
    description: "A 36-hour code sprint welcoming college candidates across the state to formulate web solutions for urban and agricultural challenges.",
    event_date: "2026-09-15",
    category: "Hackathons",
    image_url: "/images/student-life/coding.webp"
  }
];


export const campusService = {
  getInfrastructure: (facilityType?: string) => {
    const queryStr = facilityType ? `?facility_type=${encodeURIComponent(facilityType)}` : "";
    return apiFetch<InfrastructureItem[]>(`/api/v1/campus/infrastructure${queryStr}`, fallbackInfrastructure);
  },
  getLabs: (departmentId?: string) => {
    const queryStr = departmentId ? `?department_id=${encodeURIComponent(departmentId)}` : "";
    return apiFetch<LaboratoryItem[]>(`/api/v1/campus/labs${queryStr}`, fallbackLabs);
  },
  getLibrary: () => apiFetch<LibraryInfo>(`/api/v1/campus/library`, fallbackLibrary),
  getHostels: () => apiFetch<HostelInfo[]>(`/api/v1/campus/hostel`, fallbackHostels),
  getSports: () => apiFetch<SportsItem[]>(`/api/v1/campus/sports`, fallbackSports),
  getClubs: () => apiFetch<ClubItem[]>(`/api/v1/campus/clubs`, fallbackClubs),
  getEvents: () => apiFetch<CampusEventItem[]>(`/api/v1/campus/events`, fallbackEvents),

  // Legacy wrappers
  getCampusLocations: () => apiFetch<CampusLocation[]>("/api/v1/campus/campus-locations", fallbackLocations),
  getFacilities: () => apiFetch<Facility[]>("/api/v1/campus/facilities", []),
  getGallery: () => apiFetch<GalleryItem[]>("/api/v1/campus/gallery", []),
};
