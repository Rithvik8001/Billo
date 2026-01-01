import Image from "next/image";

interface UploadProgressProps {
  imageUrl: string;
  progress: number;
}

export function UploadProgress({ imageUrl, progress }: UploadProgressProps) {
  return (
    <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="shrink-0">
          <Image
            src={imageUrl}
            alt="Receipt preview"
            width={256}
            height={256}
            className="w-full md:w-64 h-auto rounded-lg object-contain border"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">Uploading...</h3>
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">{progress}% complete</p>
        </div>
      </div>
    </div>
  );
}

