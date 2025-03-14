"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Eye, Pause, Play, Trash2 } from "lucide-react";
import Scanner from "@/components/Scanner";

interface ScanResult {
  barcode: string;
  isDuplicate: boolean;
}

export default function Home() {
  // State untuk menyimpan riwayat scan (array string)
  const [scannedHistory, setScannedHistory] = useState<ScanResult[]>([]);
  // State untuk menampilkan barcode terakhir di Input
  const [lastScanned, setLastScanned] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false)

  const handleScan = (barcode: string, isDuplicate: boolean) => {
    setLastScanned(barcode);
    setScannedHistory((prev) => [...prev, {barcode, isDuplicate}]);
  };

  // Fungsi reset untuk mengosongkan history dan input
  const handleReset = () => {
    setScannedHistory([]);
    setLastScanned("");
  };

  const toggleScanning = () => {
    setIsScanning((prev) => !prev)
  }

  return (
    <div className="grid grid-rows-[10px_1fr_10px] items-center justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="border rounded-lg flex flex-col h-[390px] w-full p-2 border-primary items-center justify-center">
          <div className={`${isScanning ?? "hidden"} text-muted-foreground font-mono text-center`}>
            <Scanner onScan={handleScan} isActive={isScanning} />
          </div>
          <p className={`${isScanning && "hidden"} text-muted-foreground font-mono text-center`}>Kamera mati.</p>
        </div>

        <div className="space-y-3">
        <div className="flex gap-2 items-center justify-center w-full">
          <Input className="w-full border-primary font-mono bg-muted text-primary" value={lastScanned || "Result"} disabled />
          <Drawer>
            <DrawerTrigger asChild>
              <Button size='icon' variant='outline'><Eye /></Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Riwayat Scan</DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                {scannedHistory.length === 0 ? (
                  <p className='text-muted-foreground font-mono text-center'>Tidak ada scan.</p>
                ) : (
                  <div className="text-wrap p-2 max-h-[300px] overflow-y-scroll">
                  <div className="flex flex-col-reverse">
                    {scannedHistory.map((code, idx) => (
                      <p className={`font-mono ${code.isDuplicate ? "text-destructive" : "text-primary"}`} key={idx}>{code.barcode}</p>
                    ))}
                  </div>
                  </div>
                )}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="flex gap-2 w-full justify-end">
          <Button onClick={toggleScanning} className="">
            {isScanning ? <Pause /> : <Play />}
            {isScanning ? "Pause" : "Mulai"}
          </Button>
          <Button className="" variant='destructive' onClick={handleReset}><Trash2 />Reset</Button>
        </div>
        </div>
      </main>
      <footer className="fixed w-full bottom-12 px-6 flex gap-6 flex-col items-center justify-center">
      </footer>
    </div>
  );
}