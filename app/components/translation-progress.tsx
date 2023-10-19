type TranslationProgressProps = {
  currentProcessingTranslationsCount: number;
  totalProcessingTranslationsCount: number;
};

export function TranslationProgress({
  currentProcessingTranslationsCount,
  totalProcessingTranslationsCount,
}: TranslationProgressProps) {
  if (totalProcessingTranslationsCount === 0) {
    return null;
  }

  return (
    <div className="text-sm font-medium">
      {totalProcessingTranslationsCount - currentProcessingTranslationsCount}/
      {totalProcessingTranslationsCount}
    </div>
  );
}
