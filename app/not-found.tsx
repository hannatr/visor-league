import Link from "next/link";
import { RiErrorWarningLine } from "@remixicon/react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFoundPage() {
  return (
    <section className="min-h-screen grow bg-muted/40">
      <div className="container m-auto max-w-2xl py-24">
        <Card className="m-4 md:m-0">
          <CardHeader className="items-center text-center">
            <RiErrorWarningLine className="size-20 text-chart-1" />
            <CardTitle className="text-3xl">Page Not Found</CardTitle>
            <CardDescription className="text-xl">
              FORE! You hit one out of bounds.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-10">
            <Link href="/" className={buttonVariants()}>
              Go Home
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
