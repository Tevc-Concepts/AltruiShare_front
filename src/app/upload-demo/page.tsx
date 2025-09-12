import { FileUpload } from '../../features/upload/components/FileUpload'

export default function UploadDemoPage() {
    return (
        <main className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-brand-hero">Upload Demo</h1>
            {/* Feature Demo: Remove or gate behind auth/feature flag in production */}
            <FileUpload auto maxConcurrent={2} />
        </main>
    )
}
