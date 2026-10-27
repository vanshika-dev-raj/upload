import CameraCapture from "@/app/ui/camera-capture";
import FileUpload from "@/app/ui/file-upload";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:gap-8 sm:py-16">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Upload center</h1>
        <p className="text-sm text-muted">Take a photo or upload a document.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Camera">
          <CameraCapture />
        </Card>
        <Card title="Upload a file">
          <FileUpload />
        </Card>
      </div>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 sm:p-5">
      <h2 className="text-sm font-medium">{title}</h2>
      {children}
    </section>
  );
}
