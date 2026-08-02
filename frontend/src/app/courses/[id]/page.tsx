import type { Metadata } from "next";
import CourseDetailClient from "@/components/courses/CourseDetailClient";
import { notFound } from "next/navigation";
import { academicService } from "@/services/academicService";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const startTime = Date.now();
  const { id } = await params;
  console.log(`[generateMetadata] starting for course id: ${id}`);
  const res = await academicService.getCourse(id);
  const course = res.data;
  const duration = Date.now() - startTime;
  console.log(`[generateMetadata] finished in ${duration}ms for course id: ${id}`);
  if (!course) return { title: "Course Not Found | CampusConnect AI" };
  return {
    title: `${course.course_name} | Sri Satya Institute of Engineering and Technology`,
    description: `Explore B.Tech ${course.course_name} at SSIET. Learn about eligibility criteria, transparent fee structures, academic features, and career opportunities.`,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const startTime = Date.now();
  const { id } = await params;
  console.log(`[CourseDetailPage] rendering start for course id: ${id}`);
  const res = await academicService.getCourse(id);
  const course = res.data;
  const duration = Date.now() - startTime;
  console.log(`[CourseDetailPage] rendering fetch finished in ${duration}ms for course id: ${id}`);
  if (!course) notFound();
  return <CourseDetailClient course={course} />;
}
