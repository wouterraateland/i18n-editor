import Spinner from "components/ui/spinner";

export default function LoadingState() {
  return (
    <span className="flex h-full items-center justify-center p-4">
      <Spinner />
    </span>
  );
}
