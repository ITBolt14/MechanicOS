import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Printer } from 'lucide-react'
import { PDFViewer } from '@react-pdf/renderer'
import { useEstimates } from '../../hooks/useEstimates'
import { useEstimateLines } from '../../hooks/useEstimateLines'
import { useEstimateSettings } from '../../hooks/useEstimateSettings'
import { useAuthStore } from '../../stores/authStore'
import { EstimatePDFDocument, downloadEstimatePDF } from '../../components/estimates/EstimatePDF'
import { Spinner } from '../../components/ui/Spinner'

export default function EstimatePDFPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { company } = useAuthStore()
    const { getEstimate } = useEstimates()
    const {
        labourLines, partsLines, paintLines, subletLines,
        fetchLabour, fetchParts, fetchPaint, fetchSublets,
    } = useEstimateLines(id)
    const { settings } = useEstimateSettings()

    const [estimate, setEstimate] = useState(null)
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState(false)

    useEffect(() => {
        const loadAll = async () => {
            const data = await getEstimate(id)
            setEstimate(data)
            await Promise.all([fetchLabour(), fetchParts(), fetchPaint(), fetchSublets()])
            setLoading(false)
        }
        loadAll()
    }, [id])

    const handleDownload = async () => {
        setDownloading(true)
        await downloadEstimatePDF({
            estimate,
            labourLines,
            partsLines,
            paintLines,
            subletLines,
            company,
            settings,
        })
        setDownloading(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen">
            {/* Toolbar */}
            <div className="flex items-center gap-4 px-6 py-4 bg-surface-900 border-b border-surface-800 flex-shrink-0">
                <button onClick={() => navigate(`/estimates/${id}`)} className="btn-ghost p-2">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="font-display font-bold text-white">
                        {estimate?.estimate_number} - PDF Preview
                    </h1>
                    <p className="text-surface-400 text-sm">
                        {estimate?.customers
                          ? estimate.customers.customer_type === 'company'
                            ? estimate.customers.company_name
                            : `${estimate.customers.first_name} ${estimate.customers.last_name}`
                          : ''
                        }
                    </p>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="btn-primary flex items-center gap-2"
                >
                    {downloading ? <Spinner size="sm" /> : <Download className="w-4 h-4" />}
                    {downloading ? 'Generating...' : 'Download PDF'}
                </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 bg-surface-950">
                {estimate && (
                    <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                        <EstimatePDFDocument
                          estimate={estimate}
                          labourLines={labourLines}
                          partsLines={partsLines}
                          paintLines={paintLines}
                          subletLines={subletLines}
                          company={company}
                          settings={settings}
                        />
                    </PDFViewer>
                )}
            </div>
        </div>
    )
}