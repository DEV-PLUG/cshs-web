import Menu from "@components/menu";
import { Metadata } from "next";
import MobileBottomMenu from "@components/menu/mobile";
import Link from "next/link";
import AdminPetitionsList from "./list";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '청원 관리'
  }
}

export default async function AdminPetitionsPage() {
  return (
    <main className="flex w-full min-h-screen relative overflow-hidden">
      <Menu />
      <div className="h-[100vh] z-10 w-full md:border-l-[1px] bg-white border-lightgray-100 p-5 md:p-10 overflow-auto">        
        <AdminPetitionsList />
        <MobileBottomMenu />
      </div>
    </main>
  );
}
