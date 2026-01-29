import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, QrCode, ExternalLink } from "lucide-react";
import { useRef } from "react";

interface BatchQRCodeProps {
  batchId: string;
  batchCode: string;
  size?: number;
}

export function BatchQRCode({ batchId, batchCode, size = 200 }: BatchQRCodeProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  
  // Use the published URL for QR codes so they work in production
  const baseUrl = "https://biotik.lovable.app";
  const passportUrl = `${baseUrl}/passport/${batchId}`;

  const downloadQR = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = size * 2;
      canvas.height = size * 2;
      
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${batchCode}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const openPassport = () => {
    window.open(passportUrl, "_blank");
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Batch Passport QR
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div 
          ref={qrRef}
          className="p-4 bg-white rounded-lg border"
        >
          <QRCodeSVG 
            value={passportUrl}
            size={size}
            level="H"
            includeMargin={false}
          />
        </div>
        
        <p className="text-sm text-muted-foreground text-center">
          Scan to view public verification page
        </p>
        
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={downloadQR}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={openPassport}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
