"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState, useRef, useCallback } from "react";
import { Howl } from "howler";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";

// Skema Validasi dengan Zod
const barcodeSchema = z.object({
  barcode: z.string().min(1, "Barcode tidak boleh kosong"),
});
type BarcodeFormValues = z.infer<typeof barcodeSchema>;

// Tipe untuk menyimpan hasil scan
interface ScanResult {
  barcode: string;
  isDuplicate: boolean;
}

export default function BarcodeScannerForm() {
  const form = useForm<BarcodeFormValues>({
    resolver: zodResolver(barcodeSchema),
  });

  // Mengubah state menjadi array dari ScanResult
  const [scannedBarcodes, setScannedBarcodes] = useState<ScanResult[]>([]);
  const barcodeValue = form.watch("barcode");

  // Inisialisasi instansi Howl hanya satu kali dengan useRef
  const beepSoundRef = useRef(
    new Howl({ src: ["/beep-correct.mp3"], volume: 1.0, html5: true })
  );
  const errorSoundRef = useRef(
    new Howl({ src: ["/beep-error.mp3"], volume: 1.0, html5: true })
  );

  // Fungsi Submit menggunakan useCallback untuk menjaga referensinya
  const onSubmit = useCallback((data: BarcodeFormValues) => {
    const duplicate = scannedBarcodes.some(
      (item) => item.barcode === data.barcode
    );
    if (duplicate) {
      errorSoundRef.current.stop();
      errorSoundRef.current.play();
    } else {
      beepSoundRef.current.stop();
      beepSoundRef.current.play();
    }
    // Tambahkan hasil scan ke state, meski duplikat
    setScannedBarcodes((prev) => [
      ...prev,
      { barcode: data.barcode, isDuplicate: duplicate },
    ]);
    // Reset input
    form.setValue("barcode", "");
  }, [scannedBarcodes, form]);

  // Menangkap input dari scanner (Enter untuk submit)
  useEffect(() => {
    const handleScan = (event: KeyboardEvent) => {
      if (event.key === "Enter" && barcodeValue) {
        form.handleSubmit(onSubmit)();
      }
    };
    window.addEventListener("keydown", handleScan);
    return () => window.removeEventListener("keydown", handleScan);
  }, [barcodeValue, form, onSubmit]);

  return (
    <div className="px-4 w-full flex flex-col justify-center items-center gap-6 pb-20">
      <div className="sticky top-0 py-2 bg-background border-b w-full">
        <h1 className="font-bold text-center text-md">Riwayat Scan</h1>
      </div>
      <div className="text-center space-y-1 font-mono">
        {scannedBarcodes.map((item, index) => (
          <p
            key={index}
            className={item.isDuplicate ? "text-red-500" : "text-accent-foreground"}
          >
            {item.barcode}
          </p>
        ))}
      </div>
      <div className='fixed bottom-0 w-full p-4 bg-background shadow-md shadow border-t'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=""
          >
            <Input
              {...form.register("barcode")}
              placeholder="Ketuk di sini untuk scan"
              autoFocus
              className='bg-primary placeholder:text-primary-foreground placeholder:text-center text-center text-primary-foreground focus:placeholder:text-primary'
            />
          </form>
        </Form>
      </div>
    </div>
  );
}