import {
  Cosmograph,
  CosmographProvider,
  CosmographTimeline,
} from "@cosmograph/react";
import { useCallback } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useGetTable } from "@/modules/DataAnalysis/api/useGetTable.ts";
import { TNode } from "@/modules/DataAnalysis/types/graph.ts";

const GraphFullScreen = () => {
  const { id } = useParams();
  const { data, isPending } = useGetTable(id ? +id : 1);
  const nodeColor = useCallback((n: TNode) => {
    return n.is_anomal ? "#ff006e" : "#3a86ff";
  }, []);
  const nodeSize = useCallback((n: TNode) => {
    return n.is_anomal ? 3 : 1;
  }, []);

  if (!id) return;
  if (isPending || !data) return <span className="loading"></span>;

  let points = data.data.points;

  const diff_x =
    Math.max(...points.map((el) => el.x)) -
    Math.min(...points.map((el) => el.x));
  const diff_y =
    Math.max(...points.map((el) => el.y)) -
    Math.min(...points.map((el) => el.y));
  console.log(diff_x, diff_y);
  const EXP_X = diff_x / 10000000000;
  const EXP_Y = diff_y > 10 ? diff_y / 10000000 : diff_y * 100;

  const nodes = points.map((el) => ({
    ...el,
    y: el.y * EXP_Y,
    x: el.x * EXP_X,
  }));

  return (
    <div className="h-[100vh]">
      <NavLink
        to={"/data/" + id}
        className="fixed top-4 left-4 z-50 text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </NavLink>
      <CosmographProvider nodes={nodes}>
        <Cosmograph
          initialZoomLevel={5000}
          nodeLabelClassName={"bg-white hover:bg-white text-black"}
          hoveredNodeLabelClassName={"bg-white text-black"}
          className="h-[80vh] bg-black"
          nodeColor={nodeColor}
          nodeSize={nodeSize}
          nodeLabelAccessor={(n: TNode) => n.y.toString()}
        />
        <CosmographTimeline
          className="h-[20vh] bg-[#222222] border-t-2 border-gray-400 px-4"
          filterType={"nodes"}
          accessor={(n: TNode) => new Date(n.x / EXP_X)}
        />
      </CosmographProvider>
    </div>
  );
};

export default GraphFullScreen;
