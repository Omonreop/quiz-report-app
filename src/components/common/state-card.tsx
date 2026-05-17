import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

type StateCardProps = {
  title?: string;
  description?: ReactNode;
  isLoading?: boolean;
};

export default function StateCard({
  title,
  description,
  isLoading = false,
}: StateCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex min-h-60 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        {title ? <CardTitle>{title}</CardTitle> : null}
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
    </Card>
  );
}
