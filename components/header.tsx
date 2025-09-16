"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMerchantAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Merchants", href: "/merchants" },
  { name: "Get Card", href: "/get-card" },
  { name: "Activate & Track", href: "/activate-track" },
  { name: "Contact", href: "/contact" },
  { name: "About", href: "/about" },
  { name: "Join As Merchant", href: "/partner" },
];

export function Header() { }
