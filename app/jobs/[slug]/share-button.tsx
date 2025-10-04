'use client';

export function ShareButton() {
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <button
      onClick={handleCopy}
      className="btn btn-secondary flex-1 justify-center text-sm"
    >
      Copy Link
    </button>
  );
}
