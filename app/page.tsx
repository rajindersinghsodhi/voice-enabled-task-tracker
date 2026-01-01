"use client"

import Board from "@/components/Board"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/tasks');
  }, [])
  return (
    <></>
  )
}
