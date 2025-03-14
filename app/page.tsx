import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Eye, ScanEye } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[10px_1fr_10px] items-center justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="border rounded-lg gap-8 flex flex-col h-[300px] w-full p-8 border-primary  items-center justify-center">
          <p className="text-sm font-mono text-muted-foreground">Ini nanti untuk kamera.</p>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-col items-center justify-center">
        <div className="flex gap-4 items-center justify-center">
          <Button className="w-full">Mulai</Button>
          <Button className="w-full">Reset</Button>
        </div>
        <div className="flex gap-4 items-center justify-center">
          <Input className="w-full border-primary" value="hasil qr code muncul disini" disabled />
          <Drawer>
            <DrawerTrigger asChild>
              <Button className=''><Eye /></Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Riwayat Scan</DrawerTitle>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>
      </footer>
    </div>
  );
}
