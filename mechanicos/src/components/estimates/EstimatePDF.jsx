import {
    Document, Page, Text, View, StyleSheet, Font, pdf
} from '@react-pdf/renderer'

// =================================================
// STYLES
// =================================================
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 9,
        paddingTop: 40,
        paddingBottom: 60,
        paddingHorizontal: 40,
        backgroundColor: '#ffffff',
        color: '#1a1a2e',
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#2b4ae3',
    },
    companyName: {
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
        color: '#2b4ae3',
        marginBottom: 4,
    },
    companyDetails: {
        fontSize: 8,
        color: '#666666',
        lineHeight: 1.5,
    },
    quoteTitle: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        color: '#1a1a2e',
        textAlign: 'right',
    },
    quoteNumber: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: '#2b4ae3',
        textAlign: 'right',
        marginTop: 4,
    },
    quoteStatus: {
        fontSize: 8,
        textAlign: 'right',
        color: '#666666',
        marginTop: 2,
    },

    // Customer & Vehicle Section
    infoSection: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 24,
    },
    infoBox: {
        flex: 1,
        backgroundColor: '#f8f9fb',
        borderRadius: 6,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e4e8f0',
    },
    infoBoxTitle: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: '#6b7691',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 6,
    },
    infoBoxText: {
        fontSize: 9,
        color: '#1a1a2e',
        lineHeight: 1.5,
    },
    infoBoxBold: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: '#1a1a2e',
        marginBottom: 2,
    },

    // Quote Meta
    metaRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    metaBox: {
        flex: 1,
        backgroundColor: '#f0f4fe',
        borderRadius: 6,
        padding: 10,
        borderWidth: 1,
        borderColor: '#c2d3fb',
    },
    metaLabel: {
        fontSize: 7,
        color: '#4169ee',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 3,
    },
    metaValue: {
        fontSize: 9,
        fontFamily:'Helvetica-Bold',
        color: '#1a1a2e',
    },

    // Description
    descSection: {
        marginBottom: 20,
        padding: 12,
        backgroundColor: '#f8f9fb',
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#2b4ae3',
    },
    descTitle: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: '#2b4ae3',
        marginBottom: 4,
    },
    descText: {
        fontSize: 9,
        color: '#333333',
        lineHeight: 1.5,
    },

    // Section Headers
    sectionHeader: {
        backgroundColor: '#2b4ae3',
        padding: '6 10',
        marginTop: 16,
        marginBottom: 0,
        borderRadius: 4,
    },
    sectionHeaderText: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: '#ffffff',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },

    // Table
    table: {
        borderWidth: 1,
        borderColor: '#e4e8f0',
        borderTopWidth: 0,
        marginBottom: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e4e8f0',
        minHeight: 24,
        alignItems: 'center',
    },
    tableRowAlt: {
        backgroundColor: '#f8f9fb',
    },
    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#f0f4fe',
        borderBottomWidth: 1,
        borderBottomColor: '#c2d3fb',
        minHeight: 22,
        alignItems: 'center',
    },
    tableCell: {
        padding: '4 8',
        fontSize: 8,
        color: '#333333',
    },
    tableCellHeader: {
        padding: '4 8',
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: '#4169ee',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tableCellRight: {
        textAlign: 'right',
    },
    tableCellBold: {
        fontFamily: 'Helvetica-Bold',
        color: '#1a1a2e',
    },

    // Column widths
    colDesc: { flex: 3 },
    colHours: { width: 50 },
    colRate: { width: 65 },
    colQty: { width:40 },
    colPrice: { width: 70 },
    colTotal: { width: 75 },

    // Totals
    totalsSection: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    totalsBox: {
        width: 260,
        borderWidth: 1,
        borderColor: '#e4e8f0',
        borderRadius: 6,
        overflow: 'hidden',
    },
    totalsRow: {
        flexDirection: 'row',
        padding: '7 12',
        borderBottomWidth: 1,
        borderBottomColor: '#e4e8f0',
    },
    totalsLabel: {
        flex: 1,
        fontSize: 8,
        color: '#666666',
    },
    totalsValue: {
        width: 90,
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: '#1a1a2e',
        textAlign: 'right',
    },
    totalsFinalRow: {
        flexDirection: 'row',
        padding: '10 12',
        backgroundColor: '#2b4ae3',
    },
    totalsFinalLabel: {
        flex: 1,
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: '#ffffff',
    },
    totalsFinalValue: {
        width: 90,
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: '#ffffff',
        textAlign: 'right',
    },
    vatRow: {
        flexDirection: 'row',
        padding: '7 12',
        backgroundColor: '#f0f4fe',
        borderBottomWidth: 1,
        borderBottomColor: '#c2d3fb',
    },
    vatLabel: {
        flex: 1,
        fontSize: 8, 
        color: '#4169ee'
    },
    vatValue: { 
        width: 90,
        fontSize: 8, 
        fontFamily: 'Helvetica-Bold', 
        color: '#4169ee',
        textAlign: 'right', 
    },

    // Notes
    notesSection: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#f8f9fb',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e4e8f0',
    },
    notesTitle: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: '#333333',
        marginBottom: 4,
    },
    notesText: {
        fontSize: 8,
        color: '#555555',
        lineHeight: 1.6,
    },

    // Signature
    signatureSection: {
        marginTop: 30,
        flexDirection: 'row',
        gap: 20,
    },
    signatureBox: {
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: '#333333',
        paddingTop: 6,
    },
    signatureLabel: {
        fontSize: 7,
        color: '#666666',
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#e4e8f0',
        paddingTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: {
        fontSize: 7,
        color: '#9aa3b8'
    },

    // Empty State
    emptyRow: {
        padding: '10 8',
        fontSize: 8,
        color: '#9aa3b8',
        fontStyle: 'italic',
    },
})

// =================================================
// HELPER FUNCTIONS
// =================================================
const formatAmount = (amount) => {
    if (!amount && amount !== 0) return 'R 0.00'
    return `R ${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    })
}

const getCustomerName = (customer) => {
    if (!customer) return '-'
    if (customer.customer_type === 'company') return customer.company_name
    return `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
}

const getCustomerAddress = (customer) => {
    if (!customer) return ''
    const parts = [
        customer.address_line1,
        customer.address_line2,
        customer.city,
        customer.province,
        customer.postal_code,
    ].filter(Boolean)
    return parts.join(', ')
}

// =================================================
// PDF DOCUMENT COMPONENT
// =================================================
export function EstimatePDFDocument({
    estimate,
    labourLines = [],
    partsLines = [],
    paintLines = [],
    subletLines = [],
    company,
    settings,
}) {
    const subtotal = estimate.subtotal || 0
    const vatAmount = estimate.vat_amount || 0
    const totalAmount = estimate.total_amount || 0

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* --- Header --- */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.companyName}>{company?.name || 'Workshop Name'}</Text>
                        <Text style={styles.companyDetails}>
                            {company?.address_line1 ? `${company.address_line1}/n` : ''}
                            {company?.city ? `${company.city}${company.province ? `, ${company.province}` : ''}\n` : ''}
                            {company?.phone ? `Tel: ${company.phone}\n` : ''}
                            {company?.email ? `Email: ${company.email}` : ''}
                            {company?.vat_number ? `\nVAT Reg: ${company.vat_number}` : ''}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.quoteTitle}>QUOTATION</Text>
                        <Text style={styles.quoteNumber}>{estimate.estimate_number}</Text>
                        <Text style={styles.quoteStatus}>
                            Status: {estimate.status?.toUpperCase()}
                        </Text>
                        <Text style={styles.quoteStatus}>
                            Revision: v{estimate.revision}
                        </Text>
                    </View>
                </View>

                {/* --- QUOTE META --- */}
                <View style={styles.metaRow}>
                  <View style={styles.metaBox}>
                    <Text style={styles.metaLabel}>Date</Text>
                    <Text style={styles.metaValue}>{formatDate(estimate.created_at)}</Text>
                  </View>
                  <View style={styles.metaBox}>
                    <Text style={styles.metaLabel}>Valid Until</Text>
                    <Text style={styles.metaValue}>{formatDate(estimate.valid_until)}</Text>
                  </View>
                  <View style={styles.metaBox}>
                    <Text style={styles.metaLabel}>Payment Terms</Text>
                    <Text style={styles.metaValue}>{estimate.payment_terms || '30 days'}</Text>
                  </View>
                  {estimate.job_cards && (
                    <View style={styles.metaBox}>
                        <Text style={styles.metaLabel}>Job Card</Text>
                        <Text style={styles.metaValue}>{estimate.job_cards.job_number}</Text>
                    </View>
                  )}
                </View>

                {/* --- CUSTOMER & VEHICLE --- */}
                <View style={styles.infoSection}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoBoxTitle}>Bill To</Text>
                        <Text style={styles.infoBoxBold}>{getCustomerName(estimate.customers)}</Text>
                        {estimate.customers?.phone && (
                            <Text style={styles.infoBoxText}>Tel: {estimate.customers.phone}</Text>
                        )}
                        {estimate.customers?.email && (
                            <Text style={styles.infoBoxText}>{estimate.customers.email}</Text>
                        )}
                        {getCustomerAddress(estimate.customers) && (
                            <Text style={styles.infoBoxText}>{getCustomerAddress(estimate.customers)}</Text>
                        )}
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoBoxTitle}>Vehicle</Text>
                        {estimate.vehicles && (
                            <>
                              <Text style={styles.infoBoxBold}>
                                {estimate.vehicles.year} {estimate.vehicles.make} {estimate.vehicles.model}
                              </Text>
                              <Text style={styles.infoBoxText}>
                                Reg: {estimate.vehicles.registration_number || '-'}
                              </Text>
                              {estimate.vehicles.colour && (
                                <Text style={styles.infoBoxText}>Colour: {estimate.vehicles.colour}</Text>
                              )}
                              {estimate.vehicles.vin_number && (
                                <Text style={styles.infoBoxText}>VIN: {estimate.vehicles.vin_number}</Text>
                              )}
                            </>
                        )}
                    </View>
                </View>

                {/* --- DESCRIPTION--- */}
                {estimate.description && (
                    <View style={styles.descSection}>
                        <Text style={styles.descTitle}>Scope of Work</Text>
                        <Text style={styles.descText}>{estimate.description}</Text>
                    </View>
                )}

                {/* --- LABOUR LINES --- */}
                {labourLines.length > 0 && (
                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>Labour</Text>
                        </View>
                        <View styles={styles.table}>
                            <View style={styles.tableHeaderRow}>
                                <Text style={[styles.tableCellHeader, styles.colDesc]}>Description</Text>
                                <Text style={[styles.tableCellHeader, styles.colHours, styles.tableCellRight]}>Hours</Text>
                                <Text style={[styles.tableCellHeader, styles.colRate, styles.tableCellRight]}>Rate/hr</Text>
                                <Text style={[styles.tableCellHeader, styles.colTotal, styles.tableCellRight]}>Amount</Text>
                            </View>
                            {labourLines.map((line, i) => (
                                <View key={line.id} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                                    <Text style={[styles.tableCell, styles.colDesc]}>{line.description}</Text>
                                    <Text style={[styles.tableCell, styles.colHours, styles.tableCellRight]}>{line.hours}h</Text>
                                    <Text style={[styles.tableCell, styles.colRate, styles.tableCellRight]}>{formatAmount(line.rate)}</Text>
                                    <Text style={[styles.tableCell, styles.colTotal, styles.tableCellRight, styles.tableCellBold]}>
                                        {formatAmount(line.total)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* --- PARTS LINES ---*/}
                {partsLines.length > 0 && (
                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>Parts & Materials</Text>
                        </View>
                        <View style={styles.table}>
                            <View style={styles.tableHeaderRow}>
                                <Text style={[styles.tableCellHeader, styles.colDesc]}>Description</Text>
                                <Text style={[styles.tableCellHeader, styles.colQty, styles.tableCellRight]}>Qty</Text>
                                <Text style={[styles.tableCellHeader, styles.colPrice, styles.tableCellRight]}>Unit Price</Text>
                                <Text style={[styles.tableCellHeader, styles.colTotal, styles.tableCellRight]}>Amount</Text>
                            </View>
                            {partsLines.map((line, i) => (
                                <View key={line.id} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                                    <View style={[styles.colDesc, { padding: '4 8' }]}>
                                        <Text style={{ fontSize: 8, color: '#333333' }}>{line.description}</Text>
                                        {line.part_number && (
                                            <Text style={{ fontSize: 7, color: '#9aa3b8' }}>Part #: {line.part_number}</Text>
                                        )}
                                        {line.supplier && (
                                            <Text style={{ fontSize: 7, color: '#9aa3b8' }}>{line.supplier}</Text>
                                        )}
                                    </View>
                                    <Text style={[styles.tableCell, styles.colQty, styles.tableCellRight]}>{line.quantity}</Text>
                                    <Text style={[styles.tableCell, styles.colPrice, styles.tableCellRight]}>{formatAmount(line.unit_price)}</Text>
                                    <Text style={[styles.tableCell, styles.colTotal, styles.tableCellRight, styles.tableCellBold]}>
                                        {formatAmount(line.total)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* --- PAINT LINES --- */}
                {paintLines.length > 0 && (
                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>Paint & Refinishing</Text>
                        </View>
                        <View style={styles.table}>
                            <View style={styles.tableHeaderRow}>
                                <Text style={[styles.tableCellHeader, styles.colDesc]}>Panel</Text>
                                <Text style={[styles.tableCellHeader, styles.colHours]}>Paint Code</Text>
                                <Text style={[styles.tableCellHeader, styles.colRate, styles.tableCellRight]}>Materials</Text>
                                <Text style={[styles.tableCellHeader, styles.colTotal, styles.tableCellRight]}>Amount</Text>
                            </View>
                            {paintLines.map((line, i) => (
                                <View key={line.id} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                                    <Text style={[styles.tableCell, styles.colDesc]}>{line.panel}</Text>
                                    <Text style={[styles.tableCell, styles.colHours]}>{line.paint_code || '-'}</Text>
                                    <Text style={[styles.tableCell, styles.colRate, styles.tableCellRight]}>{formatAmount(line.material_cost)}</Text>
                                    <Text style={[styles.tableCell, styles.colTotal, styles.tableCellRight, styles.tableCellBold]}>
                                        {formatAmount(line.total)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* --- SUBLET LINES --- */}
                {subletLines.length > 0 && (
                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>Sublet Work</Text>
                        </View>
                        <View style={styles.table}>
                            <View style={styles.tableHeaderRow}>
                                <Text style={[styles.tableCellHeader, styles.colDesc]}>Description</Text>
                                <Text style={[styles.tableCellHeader, styles.colHours]}>Supplier</Text>
                                <Text style={[styles.tableCellHeader, styles.colTotal, styles.tableCellRight]}>Amount</Text>
                            </View>
                            {subletLines.map((line, i) => (
                                <View key={line.id} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                                    <Text style={[styles.tableCell, styles.colDesc]}>{line.description}</Text>
                                    <Text style={[styles.tableCell, styles.colHours]}>{line.supplier || '-'}</Text>
                                    <Text style={[styles.tableCell, styles.colTotal, styles.tableCellRight, styles.tableCellBold]}>
                                        {formatAmount(line.total)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* --- TOTALS --- */}
                <View style={styles.totalsSection}>
                    <View style={styles.totalsBox}>
                        {estimate.labour_total > 0 && (
                            <View style={styles.totalsRow}>
                                <Text style={styles.totalsLabel}>Labour</Text>
                                <Text style={styles.totalsValue}>{formatAmount(estimate.labour_total)}</Text>
                            </View>
                        )}
                        {estimate.parts_total > 0 && (
                            <View style={styles.totalsRow}>
                                <Text style={styles.totalsLabel}>Parts</Text>
                                <Text style={styles.totalsValue}>{formatAmount(estimate.parts_total)}</Text>
                            </View>
                        )}
                        {estimate.paint_total > 0 && (
                            <View style={styles.totalsRow}>
                                <Text style={styles.totalsLabel}>Paint & Materials</Text>
                                <Text style={styles.totalsValue}>{formatAmount(estimate.paint_total)}</Text>
                            </View>
                        )}
                        {estimate.sublet_total > 0 && (
                            <View style={styles.totalsRow}>
                                <Text style={styles.totalsLabel}>Sublets</Text>
                                <Text style={styles.totalsValue}>{formatAmount(estimate.sublet_total)}</Text>
                            </View>
                        )}
                        {estimate.discount_amount > 0 && (
                            <View style={styles.totalsRow}>
                                <Text style={[styles.totalsLabel, { color: '#ef4444' }]}>Discount</Text>
                                <Text style={[styles.totalsValue, { color: '#ef4444' }]}>
                                    - {formatAmount(estimate.discount_amount)}
                                </Text>
                            </View>
                        )}
                        <View style={styles.totalsRow}>
                            <Text style={styles.totalsLabel}>Subtotal (excl. VAT)</Text>
                            <Text style={styles.totalsValue}>{formatAmount(subtotal)}</Text>
                        </View>
                        <View style={styles.vatRow}>
                            <Text style={styles.vatLabel}>VAT ({estimate.vat_rate}%)</Text>
                            <Text style={styles.vatValue}>{formatAmount(vatAmount)}</Text>
                        </View>
                        <View style={styles.totalsFinalRow}>
                            <Text style={styles.totalsFinalLabel}>TOTAL (incl. VAT)</Text>
                            <Text style={styles.totalsFinalValue}>{formatAmount(totalAmount)}</Text>
                        </View>
                    </View>
                </View>

                {/* --- CUSTOMER NOTES --- */}
                {estimate.notes && (
                    <View style={styles.notesSection}>
                        <Text style={styles.notesTitle}>Notes</Text>
                        <Text style={styles.notesText}>{estimate.notes}</Text>
                    </View>
                )}

                {/* --- TERMS --- */}
                {settings?.terms_and_conditions && (
                    <View style={[styles.notesSection,{ marginTop: 12 }]}>
                        <Text style={styles.notesTitle}>Terms & Conditions</Text>
                        <Text style={styles.notesText}>{settings.terms_and_conditions}</Text>
                    </View>
                )}

                {/* --- SIGNATURE --- */}
                <View style={styles.signatureSection}>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureLabel}>Customer Signature & Date</Text>
                    </View>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureLabel}>Authorised Signature & Date</Text>
                    </View>
                </View>

                {/* --- FOOTER --- */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>
                        {company?.name} • {estimate.estimate_number}
                    </Text>
                    <Text style={styles.footerText}>
                        This quotation is valid until {formatDate(estimate.valid_until)}
                    </Text>
                    <Text
                      style={styles.footerText}
                      render={({ pageNumber, totalPages }) =>
                        `Page ${pageNumber} of ${totalPages}`
                      }
                    />
                </View>
                
            </Page>
        </Document>
    )
}

// =================================================
// PDF DOWNLOAD HELPER
// =================================================
export async function downloadEstimatePDF({
    estimate,
    labourLines,
    partsLines,
    paintLines,
    subletLines,
    company,
    settings,
}) {
    const blob = await pdf(
        <EstimatePDFDocument
          estimate={estimate}
          labourLines={labourLines}
          partsLines={partsLines}
          paintLines={paintLines}
          subletLines={subletLines}
          company={company}
          settings={settings}
        />
    ).toBlob()

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${estimate.estimate_number}.pdf`
    link.click()
    URL.revokeObjectURL(url)
}