import type { Metadata } from "next";
import DepartmentDetailClient from "@/components/college/DepartmentDetailClient";
import { notFound } from "next/navigation";
import { academicService } from "@/services/academicService";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const startTime = Date.now();
  const { id } = await params;
  console.log(`[generateMetadata] starting for department id: ${id}`);
  const res = await academicService.getDepartment(id);
  const dept = res.data;
  const duration = Date.now() - startTime;
  console.log(`[generateMetadata] finished in ${duration}ms for department id: ${id}`);
  if (!dept) return { title: "Department Not Found | CampusConnect AI" };
  return {
    title: `${dept.department_name} | Sri Satya Institute of Engineering and Technology`,
    description: dept.description,
  };
}

export default async function DepartmentDetailPage({ params }: Props) {
  const startTime = Date.now();
  const { id } = await params;
  console.log(`[DepartmentDetailPage] rendering start for department id: ${id}`);
  const res = await academicService.getDepartment(id);
  const dept = res.data;
  const duration = Date.now() - startTime;
  console.log(`[DepartmentDetailPage] rendering fetch finished in ${duration}ms for department id: ${id}`);
  if (!dept) notFound();
  return <DepartmentDetailClient department={dept} />;
}
