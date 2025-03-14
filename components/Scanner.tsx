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
  // Simpan barcode yang telah terbaca tanpa memicu render ulang
  const detectedCodesRef = useRef<Set<string>>(new Set());
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    // Salin video element ke variabel lokal untuk memastikan referensi yang konsisten di cleanup
    const videoElement = videoRef.current;

    if (!isActive) {
      codeReaderRef.current?.reset();
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
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
        if (videoElement) {
          videoElement.srcObject = stream;
          videoElement.play();
        }
        codeReader.decodeFromVideoDevice(null, videoElement!, (result, error) => {
          if (result) {
            const barcode = result.getText();
            const isDuplicate = detectedCodesRef.current.has(barcode);
            if (isDuplicate) {
              try {
                soundBNotification.play();
              } catch (err) {
                console.error("Error playing duplicate sound:", err);
              }
              console.log("Barcode duplikat: ", barcode);
            } else {
              try {
                soundANotification.play();
              } catch (err) {
                console.error("Error playing new barcode sound:", err);
              }
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
      // Gunakan referensi video yang sama dari variabel lokal
      const currentVideoElement = videoRef.current;
      codeReader.reset();
      if (currentVideoElement && currentVideoElement.srcObject) {
        const stream = currentVideoElement.srcObject as MediaStream;
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