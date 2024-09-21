"use client";
import React, { useState } from "react";
import { deleteTokenCookie, getTokenCookie } from "../utilities/token";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";

const NavigationBar = () => {
  const token = getTokenCookie();
  console.log(token);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      position="sticky"
      className="bg-secondary"
      shouldHideOnScroll
      isBordered
      isBlurred={false}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link className="lg:text-3xl lg:font-bold text-white" href={"/"}>
            TYESO
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem >
          <Link className="font-semibold text-white text-xl" href="/product">
            Product
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {token ? (
          <NavbarItem className="hidden lg:flex">
            <Link href="/auth/login" onClick={deleteTokenCookie} className="font-semibold text-white text-xl">Log out</Link>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Link href="/auth/login" className="font-semibold text-white text-xl">Log in</Link>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavigationBar;
