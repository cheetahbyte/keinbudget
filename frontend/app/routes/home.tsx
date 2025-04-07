import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <div className="flex flex-col items-center justify-center min-h-svh">
    <Button>Click me!</Button>
    <Input type="email" placeholder="Email"/>
  </div>;
}
