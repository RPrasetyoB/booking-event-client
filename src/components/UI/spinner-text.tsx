import { Spinner } from "./spinner";

interface SpinnerProps {
  text: string;
}

const SpinnerWithText = ({ text }: SpinnerProps) => {
  return (
    <div className="flex items-center gap-3">
      <Spinner size="large" className="text-primary">
        <span className="text-primary">{text}</span>
      </Spinner>
    </div>
  );
};

export default SpinnerWithText;
