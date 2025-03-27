import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import defaultLogo from "../../images/logo.png";

// Register fonts if needed for better typography
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 'medium' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Roboto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    objectFit: 'contain',
  },
  headerRight: {
    textAlign: 'right',
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerText: {
    fontSize: 12,
    color: '#4b5563',
  },
  contentGrid: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 24,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: 'medium',
    color: '#111827',
  },
  addressText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 4,
    lineHeight: 1.5,
  },
  itemsBox: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  table: {
    marginTop: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
  },
  tableCell: {
    fontSize: 12,
    color: '#111827',
  },
  col1: { width: '40%' },
  col2: { width: '20%' },
  col3: { width: '20%' },
  col4: { width: '20%', textAlign: 'right' },
  totalSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'medium',
    color: '#374151',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  currencySymbol: {
    fontFamily: 'Roboto',
    fontSize: 14,
  }
});

export default function InvoicePDF({ order, orderItems }) {
  // Function to format currency
  const formatCurrency = (amount) => {
    return `INR ${amount?.toFixed(2)}`;
  };

  // Function to format order ID
  const formatOrderId = (id) => {
    return id.slice(-7).padStart(7, '0');
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src={defaultLogo} style={styles.logo} />
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>Invoice #{formatOrderId(order.id)}</Text>
            <Text style={styles.headerText}>
              Date: {new Date(order.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.contentGrid}>
          {/* Order Information */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Order Information</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Order ID:</Text>
                <Text style={styles.infoValue}>#{formatOrderId(order.id)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Total Amount:</Text>
                <Text style={styles.infoValue}>{formatCurrency(order.total_amount)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={styles.infoValue}>{order.status}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Created:</Text>
                <Text style={styles.infoValue}>
                  {new Date(order.created_at).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Customer Information */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Shipping Information</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>
                  {order.address.first_name} {order.address.last_name}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{order.phone}</Text>
              </View>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.addressText}>
                {order.address.apartment},{'\n'}
                {order.address.address},{'\n'}
                {order.address.city}, {order.address.state},{'\n'}
                {order.address.zip}, {order.address.country}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.itemsBox}>
          <Text style={styles.infoTitle}>Order Items</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Product</Text>
              <Text style={styles.col2}>Variant</Text>
              <Text style={styles.col3}>Qty</Text>
              <Text style={styles.col4}>Amount</Text>
            </View>
            {orderItems.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.col1]}>{item.product_name}</Text>
                <Text style={[styles.tableCell, styles.col2]}>{item.variant_name}</Text>
                <Text style={[styles.tableCell, styles.col3]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.col4]}>
                  {formatCurrency(item.quantity * item.discounted_price)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>{formatCurrency(order.total_amount)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
} 