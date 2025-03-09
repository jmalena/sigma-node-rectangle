import { NodeDisplayData } from "sigma/types";

interface Size2d {
  width: number;
  height: number;
}

export type NodeDisplayDataExt = NodeDisplayData & Size2d
