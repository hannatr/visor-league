import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8">
      <Skeleton className="size-16 rounded-full" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
}
