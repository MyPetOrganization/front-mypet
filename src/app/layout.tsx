import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/context/NotificationContext";
import 'rsuite/dist/rsuite.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { CustomProvider } from "rsuite";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyPet",
  description: "Ecommerce website for pet products",
};

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout ({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body className={inter.className}>
      <CustomProvider>
        <NotificationProvider>
          {/* <main className='min-h-screen flex flex-col items-center justify-center'> */}
          <main>

            {children}
          </main>
          {/* </main> */}
        </NotificationProvider>
      </CustomProvider>
      </body>
    </html>
  )
}
