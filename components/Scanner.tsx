// components/Scanner.tsx
import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Howl } from "howler";

const soundANotification = new Howl({ src: ["/beep-correct.mp3"] });
const soundBNotification = new Howl({ src: ["/beep-error.mp3"] });

interface ScannerProps {
  onScan: (barcode: string, isDuplicate: boolean) => void;
  isActive: boolean;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Menggunakan ref untuk menyimpan barcode yang sudah terbaca tanpa memicu render ulang
  const detectedCodesRef = useRef<Set<string>>(new Set());
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    if (!isActive) {
      // Jika tidak aktif, reset codeReader dan hentikan stream kamera
      codeReaderRef.current?.reset();
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      return;
    }

    // Jika aktif, mulai scanning
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        codeReader.decodeFromVideoDevice(null, videoRef.current!, (result, error) => {
          if (result) {
            const barcode = result.getText();
            const isDuplicate = detectedCodesRef.current.has(barcode);
            if (isDuplicate) {
              soundBNotification.play();
              console.log("Barcode duplikat: ", barcode);
            } else {
              soundANotification.play();
              console.log("Barcode baru: ", barcode);
              detectedCodesRef.current.add(barcode);
            }
            onScan(barcode, isDuplicate);
          }
          if (error && !(error.message.includes("No MultiFormat Readers were able"))) {
            console.error(error);
          }
        });
      })
      .catch((err) => {
        console.error("Error mengakses kamera: ", err);
      });

    return () => {
      // Saat komponen di-unmount atau isActive berubah, reset codeReader dan hentikan stream kamera
      codeReader.reset();
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isActive, onScan]);

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%", borderRadius: "8px" }} />
    </div>
  );
};

export default Scanner;