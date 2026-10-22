/** Wrap raw 16-bit little-endian mono PCM sound (what some speech services return) in a WAV file the browser can read. */
export function pcm16ToWavFile(pcm: Uint8Array, sampleRate: number, name: string): File {
  const header = new ArrayBuffer(44);
  const v = new DataView(header);
  const text = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  text(0, "RIFF");
  v.setUint32(4, 36 + pcm.byteLength, true);
  text(8, "WAVE");
  text(12, "fmt ");
  v.setUint32(16, 16, true); // size of this block
  v.setUint16(20, 1, true); // 1 = plain PCM
  v.setUint16(22, 1, true); // mono
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * 2, true); // bytes per second
  v.setUint16(32, 2, true); // bytes per sample frame
  v.setUint16(34, 16, true); // bits per sample
  text(36, "data");
  v.setUint32(40, pcm.byteLength, true);
  return new File([header, pcm as BlobPart], name, { type: "audio/wav" });
}
