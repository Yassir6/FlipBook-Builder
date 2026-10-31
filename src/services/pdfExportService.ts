/**
 * Trigger a browser download of the exact bytes of the original uploaded PDF.
 * No regeneration — the user receives the same file they uploaded.
 */
export async function downloadOriginalPdf(
  bytes: Uint8Array,
  fileName: string = 'flipbook.pdf'
): Promise<void> {
  if (!bytes || bytes.byteLength === 0) return;

  // Ensure .pdf extension, sanitize unsafe chars.
  const safe = (fileName || 'flipbook.pdf').replace(/[\\/:*?"<>|]/g, '_');
  const withExt = /\.pdf$/i.test(safe) ? safe : `${safe}.pdf`;

  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = withExt;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
