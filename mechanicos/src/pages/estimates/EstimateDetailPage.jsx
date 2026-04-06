import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    ArrowLeft, Edit, Trash2, Copy, FileText,
    Send, CheckCircle, XCircle, Car, User,
    Calendar, Hash, Download, Printer
} from 'lucide-react'
import { useEstimates } from '../../hooks/useEstimates'
import { useEstimateLines } from '../../hooks/useEstimateLines'
import { useEstimateSettings } from '../../hooks/useEstimateSettings'
import { EstimateStatusBadge, ESTIMATE_STATUSES } from '../../components/estimates/EstimateStatusBadge'
import { EstimateLabourLines } from '../../components/estimates/EstimateLabourLines'
import { EstimatePartsLines } from '../../components/estimates/EstimatePartsLines'
import { PaintCalculator } from '../../components/estimates/PaintCalculator'
import { SubletLines } from '../../components/estimates/SubletLines'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../..components/ui/ConfirmDialog'
import { Spinner } from '../../components/ui/Spinner'
import { Modal } from '../../components/ui/Modal'

const TABS = ['Summary', 'Labour', 'Parts', 'Paint & Materials', 'Sublets', 'Revisions']

export default function EstimateDetailPage() {
    
}