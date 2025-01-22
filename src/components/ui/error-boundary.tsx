"use client";

import IconRandom from "components/icons/random";
import Button from "components/ui/button";
import { FeedbackCard } from "components/ui/feedback-card";
import type { Component } from "react";
import type { ErrorBoundaryProps, FallbackProps } from "react-error-boundary";
import { ErrorBoundary as DefaultErrorBoundary } from "react-error-boundary";
import type { Override } from "utils/types";

export default function ErrorBoundary({
  fallback,
  FallbackComponent,
  fallbackRender,
  className,
  ...props
}: Override<
  ErrorBoundaryProps,
  {
    children: React.ReactNode;
    className?: string;
    fallback?: React.ReactElement<
      unknown,
      string | React.FunctionComponent | typeof Component
    > | null;
    FallbackComponent?: React.ComponentType<FallbackProps>;
    fallbackRender?: (props: FallbackProps) => React.ReactNode;
  }
>) {
  return (
    <DefaultErrorBoundary
      {...(fallback
        ? { fallback }
        : FallbackComponent
          ? { FallbackComponent }
          : fallbackRender
            ? { fallbackRender }
            : {
                fallbackRender: ({ error }) => (
                  <FeedbackCard className={className} variant="error">
                    <pre className="whitespace-pre-wrap">
                      {typeof error === "string"
                        ? error
                        : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                          (error?.message ?? "Something went wrong")}
                    </pre>
                    <Button
                      className="mt-2 theme-surface"
                      iconLeft={<IconRandom />}
                      label="Reload"
                      onClick={() => {
                        window.location.reload();
                      }}
                      outline
                      size="sm"
                      type="button"
                    />
                  </FeedbackCard>
                ),
              })}
      onError={(error) => {
        console.error(error);
      }}
      {...props}
    />
  );
}
