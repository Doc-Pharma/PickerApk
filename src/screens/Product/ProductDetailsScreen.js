import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TopBar, Button } from '../../components';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';
import { formatExpiryDate } from '../../utils/helpers';

const ProductDetailsScreen = ({ navigation, route }) => {
  const productData = route?.params?.productData;

  if (!productData) {
    return (
      <View style={styles.safe}>
        <TopBar title="Product Details" onBack={() => navigation.goBack()} />
        <View style={styles.center}>
          <Text style={styles.errorText}>Product details not found</Text>
        </View>
      </View>
    );
  }

  const {
    product,
    inventory,
    partner,
    partner_sku_id,
    invoice_number,
    batch_number,
    mrp,
    quantity,
    expiry_date,
    location,
    putaway_status,
    assigned_picker_putter,
  } = productData;

  const available_qty = inventory?.inventory_count ?? quantity ?? '-';
  const display_batch = inventory?.batch_no ?? batch_number ?? '-';
  const display_expiry = formatExpiryDate(inventory?.exp_date ?? expiry_date);
  const display_mrp = inventory?.mrp ?? mrp ?? '-';
  const display_location = inventory?.locn ?? location ?? null;
  const is_putaway_completed = putaway_status === 'COMPLETED';

  return (
    <View style={styles.safe}>
      <TopBar title="Product Details" onBack={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Product Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          <DetailRow label="Product Name" value={product?.name} />
          <DetailRow label="DPID" value={product?.dp_id} />
          <DetailRow label="Pack Size" value={product?.pack_size} />
          <DetailRow label="Manufacturer" value={product?.manufacturer} />
          <DetailRow
            label="MRP"
            value={display_mrp !== '-' ? `₹${display_mrp}` : '-'}
          />
        </View>

        {/* Batch Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Batch Details</Text>
          <DetailRow label="Batch Number" value={display_batch} />
          <DetailRow label="Available QTY" value={available_qty} />
          <DetailRow label="Expiry Date" value={display_expiry} />
        </View>

        {/* Partner Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Partner Details</Text>
          <DetailRow label="Partner Name" value={partner?.name} />
          <DetailRow label="Partner SKU ID" value={partner_sku_id} />
          <DetailRow label="Invoice Number" value={invoice_number} />
        </View>

        {/* Warehouse Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Warehouse Details</Text>
          <DetailRow
            label="Location (Bin)"
            value={display_location}
            highlight
          />
          <DetailRow
            label="Assigned Picker Name"
            value={assigned_picker_putter}
          />
          <DetailRow label="Putaway Status" value={putaway_status} />
        </View>

        {/* Verify Putaway */}
        {is_putaway_completed && (
          <View style={styles.verifySection}>
            <Button
              title="Verify Putaway"
              variant="primary"
              onPress={() =>
                navigation.navigate(Routes.PRODUCT_VERIFY_LOCATION, {
                  productId: product?.id,
                  partnerId: partner?.id,
                  batchNumber: display_batch,
                  expectedLocation: display_location,
                })
              }
            />
            <View style={styles.verifyInfo}>
              {/* Info icon */}
              <Text style={styles.infoIcon}>ⓘ</Text>
              <Text style={styles.verifyHint}>
                Scan Location QR to Verify Putaway
              </Text>
            </View>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
};

const DetailRow = ({ label, value, highlight }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    {highlight ? (
      <View style={styles.locationHighlight}>
        <Text style={styles.locationHighlightText}>
          {value !== null && value !== undefined && value !== ''
            ? String(value)
            : '-'}
        </Text>
      </View>
    ) : (
      <Text style={styles.value}>
        {value !== null && value !== undefined && value !== ''
          ? String(value)
          : '-'}
      </Text>
    )}
  </View>
);

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.g50,
  },
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.navy,
  },
  locationCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.blue,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.blue,
    marginBottom: 8,
  },
  locationValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.navy,
  },
  locationMessage: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.navy,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.blue,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g100,
  },
  label: {
    flex: 0.8,
    fontSize: 12,
    color: Colors.g500,
  },
  value: {
    flex: 1.2,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.g900,
    fontFamily: 'monospace',
    textAlign: 'right',
  },
  verifySection: {
    marginTop: 4,
    alignItems: 'center',
  },
  verifyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  infoIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.blue,
    marginRight: 5,
  },
  verifyHint: {
    fontSize: 12,
    color: Colors.blue,
    textAlign: 'center',
  },
  bottomSpace: {
    height: 30,
  },
  locationHighlight: {
    maxWidth: '60%',
  },
  locationHighlightText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.blue,
    textAlign: 'right',
  },
});
