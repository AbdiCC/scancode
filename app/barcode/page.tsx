"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef, useCallback, useState } from "react";
import { Howl } from "howler";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";

const barcodeSchema = z.object({
  barcode: z.string().min(1, "Barcode tidak boleh kosong"),
});
type BarcodeFormValues = z.infer<typeof barcodeSchema>;

interface ScanResult {
  barcode: string;
  isDuplicate: boolean;
}

export default function BarcodeScannerForm() {
  const form = useForm<BarcodeFormValues>({
    resolver: zodResolver(barcodeSchema),
  });
  const [scannedBarcodes, setScannedBarcodes] = useState<ScanResult[]>([]);
  const barcodeValue = form.watch("barcode");

  const beepSoundRef = useRef(
    new Howl({ src: ["/beep-correct.mp3"], volume: 0.9, html5: true })
  );
  const errorSoundRef = useRef(
    new Howl({ src: ["/beep-error.mp3"], volume: 0.9, html5: true })
  );

  useEffect(() => {
    beepSoundRef.current.load();
    errorSoundRef.current.load();
  }, []);

  const onSubmit = useCallback(
    (data: BarcodeFormValues) => {
      setScannedBarcodes((prev) => {
        const duplicate = prev.some((item) => item.barcode === data.barcode);
        (duplicate ? errorSoundRef : beepSoundRef).current.stop();
        (duplicate ? errorSoundRef : beepSoundRef).current.play();
        return [...prev, { barcode: data.barcode, isDuplicate: duplicate }];
      });
      form.setValue("barcode", "");
      document.querySelector<HTMLInputElement>("input[name='barcode']")?.focus();
    },
    [form]
  );

  useEffect(() => {
    const handleScan = (event: KeyboardEvent) => {
      if (document.activeElement?.tagName !== "INPUT") return;
      if (event.key === "Enter" && barcodeValue) {
        event.preventDefault();
        form.handleSubmit(onSubmit)();
      }
    };
    window.addEventListener("keydown", handleScan);
    return () => window.removeEventListener("keydown", handleScan);
  }, [barcodeValue, form, onSubmit]);

  // === Hitung resume ===
  const totalScan = scannedBarcodes.length;
  const totalDuplicate = scannedBarcodes.filter((b) => b.isDuplicate).length;
  const totalValid = totalScan - totalDuplicate;

  // Hitung jumlah barcode unik yang muncul lebih dari sekali
  const uniqueInvalid = (() => {
    const counts: Record<string, number> = {};
    for (const item of scannedBarcodes) {
      counts[item.barcode] = (counts[item.barcode] || 0) + 1;
    }
    return Object.values(counts).filter((count) => count > 1).length;
  })();

  return (
    <div className="px-4 w-full flex flex-col justify-center items-center gap-6 pb-20">
      {/* ===== HEADER ===== */}
      <div className="sticky top-0 py-2 bg-background border-b w-full space-y-1">
        <h1 className="font-bold text-center text-md">Riwayat Scan</h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-mono">
          <span>
            Total: <span className="font-semibold text-foreground">{totalScan}</span>
          </span>
          <span>
            Valid: <span className="font-semibold text-green-600">{totalValid}</span>
          </span>
          <span>
            Invalid: <span className="font-semibold text-red-500">{totalDuplicate}</span>
          </span>
          <span>
            Berulang:{" "}
            <span className="font-semibold text-yellow-600">{uniqueInvalid}</span>
          </span>
        </div>
      </div>

      {/* ===== RIWAYAT SCAN ===== */}
      <div className="text-center space-y-1 font-mono w-full">
        {scannedBarcodes.map((item, index) => (
          <p
            key={index}
            className={`transition-all ${
              item.isDuplicate
                ? "text-red-500 animate-pulse"
                : "text-accent-foreground"
            }`}
          >
            <span className="text-xs text-muted-foreground mr-2">
              {index + 1}.
            </span>
            {item.barcode}
          </p>
        ))}

        {scannedBarcodes.length === 0 && (
          <p className="text-muted-foreground text-sm italic">
            Belum ada barcode yang di-scan.
          </p>
        )}
      </div>

      {/* ===== INPUT SCANNER ===== */}
      <div className="fixed bottom-0 w-full p-4 bg-background shadow-md border-t">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Input
              {...form.register("barcode")}
              placeholder="Ketuk di sini untuk scan"
              autoFocus
              className="bg-primary placeholder:text-primary-foreground placeholder:text-center text-center text-primary-foreground focus:placeholder:text-primary"
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
