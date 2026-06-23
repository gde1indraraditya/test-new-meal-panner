"use client";

interface StarRatingProps {
  value: number | null;
  onChange?: (rating: number) => void;
  readonly?: boolean;
}

export default function StarRating({ value, onChange, readonly = false }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = value !== null && star <= value;
        return (
          <button
            key={star}
            type={onChange ? "button" : "button"}
            disabled={readonly || !onChange}
            onClick={() => onChange?.(star)}
            className={`text-lg leading-none transition-colors ${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            } ${filled ? "text-amber-400" : "text-zinc-300 dark:text-zinc-600"}`}
          >
            {filled ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}
