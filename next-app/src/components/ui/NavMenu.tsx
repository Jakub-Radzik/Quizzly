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
  const downloadReport = () => {
    console.log("download");
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
          <DropdownMenuItem onClick={downloadReport}>
            <FileDown className="mr-2 h-4 w-4" />
            <span>Export report</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
