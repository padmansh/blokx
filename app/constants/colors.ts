import { Players } from "./interfaces";

const BLUE = {
  background: "bg-[#4285F4] bg-opacity-[0.2]",
  border: "border-[#4285F4] border-opacity-[0.75]",
  text: "text-[#4285F4]",
  bgNoo: "bg-[#4285F4]",
};

const RED = {
  background: "bg-[#DB4437] bg-opacity-[0.2]",
  border: "border-[#DB4437] border-opacity-[0.75]",
  text: "text-[#DB4437]",
  bgNoo: "bg-[#DB4437]",
};

const GREEN = {
  background: "bg-[#0F9D58] bg-opacity-[0.2]",
  border: "border-[#0F9D58] border-opacity-[0.75]",
  text: "text-[#0F9D58]",
  bgNoo: "bg-[#0F9D58]",
};

const YELLOW = {
  background: "bg-[#F4B400] bg-opacity-[0.2]",
  border: "border-[#F4B400]",
  text: "text-[#F4B400]",
  bgNoo: "bg-[#F4B400]",
};

export const colorConfig = { BLUE, RED, GREEN, YELLOW };
export const players: Players = [
  { id: 1, name: "BLUE" },
  { id: 2, name: "RED" },
  { id: 3, name: "GREEN" },
  { id: 4, name: "YELLOW" },
];
