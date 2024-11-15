"use client";
import { FileText, FileDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function NavMenu() {
  const downloadReport = async () => {
    console.log("Starting download...");

    try {
      const response = await fetch("http://localhost:3002/generate-pdf", {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "report.pdf"; // You can specify the desired filename here
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
      console.log("Download complete.");
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/quiz/new" className="flex flex-row">
              <FileText className="mr-2 h-4 w-4" />
              <span>New quiz</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/dashboard" className="flex flex-row">
              <FileText className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadReport}>
            <FileDown className="mr-2 h-4 w-4" />
            <span>Export report</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
