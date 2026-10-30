import { useEffect, useState } from 'react';

function SelectedMediaPreview({ file }) {
  const [previewUrl, setPreviewUrl] = useState('');
  const isVideo = file.type.startsWith('video/');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return <div className="min-w-0 overflow-hidden rounded-sm border border-white/10 bg-ink-900">
    <div className="relative flex aspect-video items-center justify-center bg-ink-950">
      {previewUrl && (isVideo
        ? <video src={previewUrl} controls preload="metadata" className="h-full w-full object-contain" />
        : <a href={previewUrl} target="_blank" rel="noreferrer" aria-label={`View ${file.name}`} className="h-full w-full">
          <img src={previewUrl} alt={file.name} className="h-full w-full object-contain" />
        </a>)}
    </div>
    <p className="truncate px-2.5 py-2 text-xs text-ink-300" title={file.name}>{file.name}</p>
  </div>;
}

function SelectedMediaPreviews({ files }) {
  if (!files.length) return null;
  return <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-label="Selected file previews">
    {files.map((file, index) => <SelectedMediaPreview key={`${file.name}-${file.lastModified}-${index}`} file={file} />)}
  </div>;
}

export default SelectedMediaPreviews;
