"use client";
import { useParams } from "next/navigation";


export default function NFTViewPage() {
  const { id } = useParams();
  return (
    <div className="min-h-screen flex flex-col">
        {id}
    </div>
  );
}