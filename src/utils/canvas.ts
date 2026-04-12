/**
 * Split a page image into left and right halves for spread mode.
 * Returns [firstHalf, secondHalf] based on reading direction.
 */
export function splitPageImage(
  imageData: string,
  direction: 'rtl' | 'ltr'
): Promise<[string, string]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const halfWidth = Math.floor(img.width / 2);
      const height = img.height;

      const leftCanvas = document.createElement('canvas');
      leftCanvas.width = halfWidth;
      leftCanvas.height = height;
      const leftCtx = leftCanvas.getContext('2d')!;
      leftCtx.drawImage(img, 0, 0, halfWidth, height, 0, 0, halfWidth, height);

      const rightCanvas = document.createElement('canvas');
      rightCanvas.width = halfWidth;
      rightCanvas.height = height;
      const rightCtx = rightCanvas.getContext('2d')!;
      rightCtx.drawImage(img, halfWidth, 0, halfWidth, height, 0, 0, halfWidth, height);

      const leftData = leftCanvas.toDataURL('image/png');
      const rightData = rightCanvas.toDataURL('image/png');

      // Clean up
      leftCanvas.width = leftCanvas.height = 0;
      rightCanvas.width = rightCanvas.height = 0;

      // RTL: right half is "first" page, left half is "second"
      // LTR: left half is "first" page, right half is "second"
      if (direction === 'rtl') {
        resolve([rightData, leftData]);
      } else {
        resolve([leftData, rightData]);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image for splitting'));
    img.src = imageData;
  });
}

/**
 * Generate a thumbnail from a full-size page image.
 */
export function generateThumbnail(
  imageData: string,
  maxWidth: number = 150
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = maxWidth / img.width;
      const width = maxWidth;
      const height = Math.floor(img.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
      canvas.width = canvas.height = 0;
      resolve(thumbnail);
    };
    img.onerror = () => reject(new Error('Failed to generate thumbnail'));
    img.src = imageData;
  });
}
